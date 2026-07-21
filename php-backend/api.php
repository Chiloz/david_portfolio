<?php
/**
 * PHP REST API for David Chilengwa's Portfolio
 * Bridges Firestore Database & Cloudinary Streaming seamlessly.
 * Acts as a mirror replacement for server.ts on PHP host environments (e.g. Render, Heroku, cPanel).
 */

// Enable CORS so your Vercel React app can connect
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration (Defaults mirror the Express setup)
$projectId = getenv('FIREBASE_PROJECT_ID') ?: "david-portfolio-71fcc";
$cloudinaryCloudName = getenv('CLOUDINARY_CLOUD_NAME') ?: "jzepzwix";
$cloudinaryPreset = getenv('CLOUDINARY_UPLOAD_PRESET') ?: "David_Portfolio";

// Parse URL path to match endpoints
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];

// Extract the sub-path after api.php
$basePath = str_replace('index.php', '', $scriptName);
$basePath = str_replace('api.php', '', $basePath);
$route = str_replace($basePath, '', $requestUri);
$route = parse_url($route, PHP_URL_PATH);
$route = trim($route, '/');

// Method of request
$method = $_SERVER['REQUEST_METHOD'];

// Helper to read JSON request body
function get_json_input() {
    $rawInput = file_get_contents('php://input');
    return json_decode($rawInput, true) ?: [];
}

// Helper to make curl requests (to Firestore & Cloudinary)
function make_request($url, $method = 'GET', $body = null, $headers = []) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    
    if ($body !== null) {
        if (is_array($body) && !isset($headers['Content-Type'])) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($body));
        } else {
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($body) ? $body : json_encode($body));
        }
    }
    
    $formattedHeaders = [];
    foreach ($headers as $key => $val) {
        $formattedHeaders[] = "$key: $val";
    }
    
    if (!empty($formattedHeaders)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $formattedHeaders);
    }
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'code' => $httpCode,
        'body' => json_decode($response, true) ?: $response
    ];
}

// REST Client Routing
switch (true) {
    // ----------------------------------------------------
    // GET /api/projects - Retrieve projects from Firestore
    // ----------------------------------------------------
    case ($route === 'api/projects' && $method === 'GET'):
    case ($route === 'projects' && $method === 'GET'):
        $url = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/projects";
        $res = make_request($url, 'GET');
        
        $projects = [];
        if (isset($res['body']['documents'])) {
            foreach ($res['body']['documents'] as $doc) {
                $parts = explode('/', $doc['name']);
                $id = end($parts);
                $fields = $doc['fields'] ?? [];
                
                $projects[] = [
                    'id' => $id,
                    'title' => $fields['title']['stringValue'] ?? '',
                    'description' => $fields['description']['stringValue'] ?? '',
                    'techStack' => $fields['techStack']['stringValue'] ?? '',
                    'imageUrl' => $fields['imageUrl']['stringValue'] ?? '',
                    'projectUrl' => $fields['projectUrl']['stringValue'] ?? '',
                    'createdAt' => $fields['createdAt']['stringValue'] ?? ''
                ];
            }
        }
        
        // Sort projects by createdAt desc
        usort($projects, function($a, $b) {
            return strcmp($b['createdAt'], $a['createdAt']);
        });
        
        echo json_encode($projects);
        break;

    // ----------------------------------------------------
    // POST /api/projects - Create project & upload image to Cloudinary
    // ----------------------------------------------------
    case ($route === 'api/projects' && $method === 'POST'):
    case ($route === 'projects' && $method === 'POST'):
        $input = get_json_input();
        $title = $input['title'] ?? null;
        $description = $input['description'] ?? null;
        $techStack = $input['techStack'] ?? null;
        $imageBase64 = $input['imageBase64'] ?? null;
        $projectUrl = $input['projectUrl'] ?? '';

        if (!$title || !$description || !$techStack || !$imageBase64) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields (title, description, techStack, imageBase64)']);
            break;
        }

        // 1. Upload Base64 file stream to Cloudinary
        $cloudinaryUrl = "https://api.cloudinary.com/v1_1/{$cloudinaryCloudName}/image/upload";
        $uploadData = [
            'file' => $imageBase64,
            'upload_preset' => $cloudinaryPreset
        ];
        
        $cloudinaryRes = make_request($cloudinaryUrl, 'POST', $uploadData);
        if ($cloudinaryRes['code'] !== 200 || !isset($cloudinaryRes['body']['secure_url'])) {
            http_response_code(500);
            $err = is_array($cloudinaryRes['body']) ? ($cloudinaryRes['body']['error']['message'] ?? 'Cloudinary Upload Failed') : 'Cloudinary Connection Error';
            echo json_encode(['error' => $err]);
            break;
        }
        
        $secureUrl = $cloudinaryRes['body']['secure_url'];

        // 2. Write document to Firestore
        $firestoreUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/projects";
        $createdAt = date('c'); // ISO 8601
        
        $docBody = [
            'fields' => [
                'title' => ['stringValue' => $title],
                'description' => ['stringValue' => $description],
                'techStack' => ['stringValue' => $techStack],
                'imageUrl' => ['stringValue' => $secureUrl],
                'projectUrl' => ['stringValue' => $projectUrl],
                'createdAt' => ['stringValue' => $createdAt]
            ]
        ];

        $firestoreRes = make_request($firestoreUrl, 'POST', $docBody, ['Content-Type' => 'application/json']);
        if ($firestoreRes['code'] !== 200) {
            http_response_code(500);
            echo json_encode(['error' => 'Firestore save failed', 'details' => $firestoreRes['body']]);
            break;
        }

        $parts = explode('/', $firestoreRes['body']['name']);
        $newId = end($parts);

        http_response_code(201);
        echo json_encode([
            'id' => $newId,
            'title' => $title,
            'description' => $description,
            'techStack' => $techStack,
            'imageUrl' => $secureUrl,
            'projectUrl' => $projectUrl,
            'createdAt' => $createdAt,
            'message' => 'Project successfully created'
        ]);
        break;

    // ----------------------------------------------------
    // PUT /api/projects/:id - Edit project metadata
    // ----------------------------------------------------
    case (preg_match('/^(api\/)?projects\/([a-zA-Z0-9\-_]+)$/', $route, $matches) && $method === 'PUT'):
        $projectIdDoc = $matches[2];
        $input = get_json_input();
        
        // Read existing document to verify
        $getDocUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/projects/{$projectIdDoc}";
        $getRes = make_request($getDocUrl, 'GET');
        if ($getRes['code'] === 404) {
            http_response_code(404);
            echo json_encode(['error' => 'Project not found']);
            break;
        }

        $existingFields = $getRes['body']['fields'] ?? [];
        
        // Merge updates
        $fieldsToUpdate = [];
        $updateMask = [];
        
        if (isset($input['title'])) {
            $existingFields['title'] = ['stringValue' => $input['title']];
            $updateMask[] = 'updateMask.fieldPaths=title';
        }
        if (isset($input['description'])) {
            $existingFields['description'] = ['stringValue' => $input['description']];
            $updateMask[] = 'updateMask.fieldPaths=description';
        }
        if (isset($input['techStack'])) {
            $existingFields['techStack'] = ['stringValue' => $input['techStack']];
            $updateMask[] = 'updateMask.fieldPaths=techStack';
        }
        if (isset($input['imageUrl'])) {
            $existingFields['imageUrl'] = ['stringValue' => $input['imageUrl']];
            $updateMask[] = 'updateMask.fieldPaths=imageUrl';
        }
        if (isset($input['projectUrl'])) {
            $existingFields['projectUrl'] = ['stringValue' => $input['projectUrl']];
            $updateMask[] = 'updateMask.fieldPaths=projectUrl';
        }
        
        $existingFields['updatedAt'] = ['stringValue' => date('c')];
        $updateMask[] = 'updateMask.fieldPaths=updatedAt';

        $maskQuery = implode('&', $updateMask);
        $patchUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/projects/{$projectIdDoc}?{$maskQuery}";
        
        $patchBody = ['fields' => $existingFields];
        $patchRes = make_request($patchUrl, 'PATCH', $patchBody, ['Content-Type' => 'application/json']);

        if ($patchRes['code'] !== 200) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update Firestore document', 'details' => $patchRes['body']]);
            break;
        }

        echo json_encode([
            'id' => $projectIdDoc,
            'message' => 'Project updated successfully'
        ]);
        break;

    // ----------------------------------------------------
    // DELETE /api/projects/:id - Delete project
    // ----------------------------------------------------
    case (preg_match('/^(api\/)?projects\/([a-zA-Z0-9\-_]+)$/', $route, $matches) && $method === 'DELETE'):
        $projectIdDoc = $matches[2];
        $delUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/projects/{$projectIdDoc}";
        $delRes = make_request($delUrl, 'DELETE');
        
        if ($delRes['code'] !== 200) {
            http_response_code(404);
            echo json_encode(['error' => 'Project not found or already deleted']);
            break;
        }

        echo json_encode([
            'id' => $projectIdDoc,
            'message' => 'Project deleted successfully'
        ]);
        break;

    // ----------------------------------------------------
    // GET /api/skills - Retrieve active skills from Firestore
    // ----------------------------------------------------
    case ($route === 'api/skills' && $method === 'GET'):
    case ($route === 'skills' && $method === 'GET'):
        $url = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/skills";
        $res = make_request($url, 'GET');
        
        $skills = [];
        if (isset($res['body']['documents'])) {
            foreach ($res['body']['documents'] as $doc) {
                $parts = explode('/', $doc['name']);
                $id = end($parts);
                $fields = $doc['fields'] ?? [];
                
                $skills[] = [
                    'id' => $id,
                    'category' => $fields['category']['stringValue'] ?? '',
                    'items' => $fields['items']['stringValue'] ?? ''
                ];
            }
        }
        
        echo json_encode($skills);
        break;

    // ----------------------------------------------------
    // POST /api/skills - Create new skill item node
    // ----------------------------------------------------
    case ($route === 'api/skills' && $method === 'POST'):
    case ($route === 'skills' && $method === 'POST'):
        $input = get_json_input();
        $category = $input['category'] ?? null;
        $items = $input['items'] ?? null;

        if (!$category || !$items) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields (category, items)']);
            break;
        }

        $url = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/skills";
        $docBody = [
            'fields' => [
                'category' => ['stringValue' => $category],
                'items' => ['stringValue' => $items],
                'createdAt' => ['stringValue' => date('c')]
            ]
        ];

        $res = make_request($url, 'POST', $docBody, ['Content-Type' => 'application/json']);
        if ($res['code'] !== 200) {
            http_response_code(500);
            echo json_encode(['error' => 'Firestore save failed']);
            break;
        }

        $parts = explode('/', $res['body']['name']);
        $newId = end($parts);

        http_response_code(201);
        echo json_encode([
            'id' => $newId,
            'category' => $category,
            'items' => $items,
            'message' => 'Skill category created successfully'
        ]);
        break;

    // ----------------------------------------------------
    // PUT /api/skills/:id - Edit skill
    // ----------------------------------------------------
    case (preg_match('/^(api\/)?skills\/([a-zA-Z0-9\-_]+)$/', $route, $matches) && $method === 'PUT'):
        $skillIdDoc = $matches[2];
        $input = get_json_input();
        
        $getDocUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/skills/{$skillIdDoc}";
        $getRes = make_request($getDocUrl, 'GET');
        if ($getRes['code'] === 404) {
            http_response_code(404);
            echo json_encode(['error' => 'Skill not found']);
            break;
        }

        $existingFields = $getRes['body']['fields'] ?? [];
        $updateMask = [];

        if (isset($input['category'])) {
            $existingFields['category'] = ['stringValue' => $input['category']];
            $updateMask[] = 'updateMask.fieldPaths=category';
        }
        if (isset($input['items'])) {
            $existingFields['items'] = ['stringValue' => $input['items']];
            $updateMask[] = 'updateMask.fieldPaths=items';
        }

        $maskQuery = implode('&', $updateMask);
        $patchUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/skills/{$skillIdDoc}?{$maskQuery}";
        
        $patchBody = ['fields' => $existingFields];
        $patchRes = make_request($patchUrl, 'PATCH', $patchBody, ['Content-Type' => 'application/json']);

        if ($patchRes['code'] !== 200) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update Firestore document']);
            break;
        }

        echo json_encode([
            'id' => $skillIdDoc,
            'message' => 'Skill category updated successfully'
        ]);
        break;

    // ----------------------------------------------------
    // DELETE /api/skills/:id - Delete skill
    // ----------------------------------------------------
    case (preg_match('/^(api\/)?skills\/([a-zA-Z0-9\-_]+)$/', $route, $matches) && $method === 'DELETE'):
        $skillIdDoc = $matches[2];
        $delUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/skills/{$skillIdDoc}";
        $delRes = make_request($delUrl, 'DELETE');
        
        if ($delRes['code'] !== 200) {
            http_response_code(404);
            echo json_encode(['error' => 'Skill category not found']);
            break;
        }

        echo json_encode([
            'id' => $skillIdDoc,
            'message' => 'Skill category deleted successfully'
        ]);
        break;

    // ----------------------------------------------------
    // GET /api/settings - Fetch global portfolio details
    // ----------------------------------------------------
    case ($route === 'api/settings' && $method === 'GET'):
    case ($route === 'settings' && $method === 'GET'):
        $url = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/settings/main_settings";
        $res = make_request($url, 'GET');
        
        if ($res['code'] === 404) {
            echo json_encode((object)[]);
            break;
        }

        $fields = $res['body']['fields'] ?? [];
        $settings = [];
        foreach ($fields as $key => $val) {
            $settings[$key] = $val['stringValue'] ?? '';
        }
        
        echo json_encode($settings);
        break;

    // ----------------------------------------------------
    // POST /api/settings - Update global metadata
    // ----------------------------------------------------
    case ($route === 'api/settings' && $method === 'POST'):
    case ($route === 'settings' && $method === 'POST'):
        $input = get_json_input();
        
        $getDocUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/settings/main_settings";
        $getRes = make_request($getDocUrl, 'GET');
        
        $existingFields = [];
        if ($getRes['code'] === 200) {
            $existingFields = $getRes['body']['fields'] ?? [];
        }

        $fields = [
            'heroTitle', 'heroSubtitle', 'aboutText', 'availableText', 'phone', 'email', 'resumeFileName', 'homeMediaUrl', 'resumeBase64'
        ];

        foreach ($fields as $field) {
            if (isset($input[$field])) {
                $existingFields[$field] = ['stringValue' => $input[$field]];
            }
        }

        // Handle homepage background image upload if stream present
        if (!empty($input['homeMediaBase64'])) {
            $cloudinaryUrl = "https://api.cloudinary.com/v1_1/{$cloudinaryCloudName}/image/upload";
            $uploadData = [
                'file' => $input['homeMediaBase64'],
                'upload_preset' => $cloudinaryPreset
            ];
            $cloudinaryRes = make_request($cloudinaryUrl, 'POST', $uploadData);
            if ($cloudinaryRes['code'] === 200 && isset($cloudinaryRes['body']['secure_url'])) {
                $existingFields['homeMediaUrl'] = ['stringValue' => $cloudinaryRes['body']['secure_url']];
            }
        }

        // Save back via PATCH or POST depending on whether it exists
        if ($getRes['code'] === 200) {
            $patchUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/settings/main_settings";
            $patchBody = ['fields' => $existingFields];
            $patchRes = make_request($patchUrl, 'PATCH', $patchBody, ['Content-Type' => 'application/json']);
            $finalData = $patchRes['body'];
        } else {
            // Write new document with ID 'main_settings'
            $postUrl = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/settings?documentId=main_settings";
            $postBody = ['fields' => $existingFields];
            $postRes = make_request($postUrl, 'POST', $postBody, ['Content-Type' => 'application/json']);
            $finalData = $postRes['body'];
        }

        $settings = [];
        $outFields = $finalData['fields'] ?? [];
        foreach ($outFields as $key => $val) {
            $settings[$key] = $val['stringValue'] ?? '';
        }

        echo json_encode([
            'message' => 'Settings updated successfully',
            'settings' => $settings
        ]);
        break;

    // ----------------------------------------------------
    // GET /api/resume/download - Stream resume binary out
    // ----------------------------------------------------
    case ($route === 'api/resume/download' && $method === 'GET'):
    case ($route === 'resume/download' && $method === 'GET'):
        $url = "https://firestore.googleapis.com/v1/projects/{$projectId}/databases/(default)/documents/settings/main_settings";
        $res = make_request($url, 'GET');
        
        if ($res['code'] === 200 && isset($res['body']['fields']['resumeBase64']['stringValue'])) {
            $base64 = $res['body']['fields']['resumeBase64']['stringValue'];
            $fileName = $res['body']['fields']['resumeFileName']['stringValue'] ?? "David_Chilengwa_Resume.pdf";
            
            // Extract pure base64 characters
            if (strpos($base64, ',') !== false) {
                $base64 = explode(',', $base64)[1];
            }
            
            $binary = base64_decode($base64);
            header("Content-Type: application/pdf");
            header("Content-Disposition: attachment; filename=\"{$fileName}\"");
            echo $binary;
            exit();
        } else {
            // Fallback plain-text resume response
            $fileName = "David_Chilengwa_Resume_Fallback.txt";
            header("Content-Type: text/plain");
            header("Content-Disposition: attachment; filename=\"{$fileName}\"");
            echo "DAVID CHILENGWA - PROFESSIONAL PORTFOLIO RESUME\n\nContact: +260768409033 | deavchile@gmail.com\nZambia\n\nFull-Stack Developer & IT Solutions Architect\n\nTECHNICAL SKILLS:\n- Web: Next.js, React, Tailwind CSS, HTML5, CSS3, ESNext\n- Backend & Cloud: Node.js, Express, Firebase Firestore, Cloud SQL, AWS Cloud\n- Infrastructure: DevOps, Kubernetes, Docker, Network Routing, Zero Trust Security\n\n(This is a text fallback resume. Admin can upload a real PDF resume in the Admin Dashboard setting to replace this fallback!)";
            exit();
        }
        break;

    // ----------------------------------------------------
    // fallback - 404 Route Not Found
    // ----------------------------------------------------
    default:
        http_response_code(404);
        echo json_encode(['error' => 'API Endpoint Node Not Found', 'route' => $route]);
        break;
}
