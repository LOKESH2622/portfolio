// ==================== MILES MORALES - USER BEHAVIOR REACTIONS ====================
// Features:
// 1. Model centered and displayed properly
// 2. Watches user (follows cursor)
// 3. Think reaction when user types
// 4. Click reaction when user clicks

(function() {
    'use strict';
    
    function initContact3D() {
        const canvas = document.getElementById('contact-canvas');
        if (!canvas) {
            setTimeout(initContact3D, 100);
            return;
        }
        
        // ==================== SCENE SETUP ====================
        const scene = new THREE.Scene();
        
        const container = canvas.parentElement;
        const width = container.clientWidth || 400;
        const height = container.clientHeight || 400;
        
        // Camera positioned for bust view
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 2.5;
        
        // ==================== LIGHTING ====================
        // Strong ambient for visibility
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Key light - main illumination
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
        keyLight.position.set(3, 5, 5);
        scene.add(keyLight);
        
        // Fill light
        const fillLight = new THREE.DirectionalLight(0x8888ff, 0.6);
        fillLight.position.set(-3, 3, 3);
        scene.add(fillLight);
        
        // Rim light - red for Spider-Man vibe
        const rimLight = new THREE.DirectionalLight(0xff4444, 0.8);
        rimLight.position.set(0, 3, -3);
        scene.add(rimLight);
        
        // Front light
        const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
        frontLight.position.set(0, 0, 5);
        scene.add(frontLight);
        
        // ==================== VARIABLES ====================
        let model = null;
        let head = null;  // Reference to head bone for up/down
        const clock = new THREE.Clock();
        
        // Cursor tracking
        let mouseX = 0;
        let mouseY = 0;
        let targetRotX = 0;
        let targetRotY = 0;
        let currentRotX = 0;
        let currentRotY = 0;
        let currentHeadRotX = 0;  // Separate head rotation
        
        // States
        let isClickReacting = false;
        let clickPhase = 0;
        
        // Model base position
        let modelBaseY = 0;
        
        // ==================== LOAD MODEL ====================
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'src/assets/miles_morales_bust.glb',
            function(gltf) {
                model = gltf.scene;
                
                // Log all parts and find head
                model.traverse(function(child) {
                    console.log('Part:', child.name, child.type);
                    const name = child.name.toLowerCase();
                    // Find head bone
                    if (name.includes('head') && !name.includes('headtop') && !head) {
                        head = child;
                        console.log('Head found:', child.name);
                    }
                });
                
                // Calculate bounding box and center
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                console.log('Model size:', size);
                console.log('Model center:', center);
                
                // Center the model for bust display
                model.position.x = -center.x;
                model.position.y = -center.y - 0.5;  // Centered position
                model.position.z = -center.z;
                
                // Scale for bust model
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 3.0 / maxDim;
                model.scale.setScalar(scale);
                
                // No tilt
                model.rotation.x = 0;
                
                // Store base Y position
                modelBaseY = model.position.y;
                
                scene.add(model);
                
                console.log('Miles Morales loaded!');
            },
            function(xhr) {
                console.log('Loading: ' + Math.round((xhr.loaded / xhr.total) * 100) + '%');
            },
            function(error) {
                console.error('Error loading model:', error);
            }
        );
        
        // ==================== CURSOR TRACKING ====================
        function onMouseMove(event) {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        }
        
        function onTouchMove(event) {
            if (event.touches.length > 0) {
                mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
                mouseY = (event.touches[0].clientY / window.innerHeight) * 2 - 1;
            }
        }
        
        // ==================== CLICK REACTION ====================
        function triggerClickReaction() {
            if (isClickReacting) return;
            
            isClickReacting = true;
            clickPhase = 0;
            
            setTimeout(() => {
                isClickReacting = false;
            }, 1000);
        }
        
        // ==================== EVENT LISTENERS ====================
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('touchmove', onTouchMove, { passive: true });
        canvas.addEventListener('click', triggerClickReaction, false);
        canvas.addEventListener('touchstart', triggerClickReaction, { passive: true });
        canvas.style.cursor = 'pointer';
        
        // Resize handler
        function onWindowResize() {
            const w = container.clientWidth || 400;
            const h = container.clientHeight || 400;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', onWindowResize, false);
        
        // ==================== ANIMATION LOOP ====================
        function animate() {
            requestAnimationFrame(animate);
            
            const delta = clock.getDelta();
            const time = Date.now() * 0.001;
            
            if (model) {
                // ===== SMOOTH CURSOR TRACKING =====
                // Body rotates left/right only
                targetRotY = mouseX * Math.PI * 0.3;
                
                // Smooth interpolation
                const easing = 0.05;
                currentRotY += (targetRotY - currentRotY) * easing;
                
                // Apply body rotation (only Y axis - left/right)
                model.rotation.y = currentRotY;
                
                // ===== CLICK REACTION (nod + bounce) =====
                if (isClickReacting) {
                    clickPhase += delta * 8;
                    // Head nod animation
                    const nod = Math.sin(clickPhase * 4) * 0.15 * Math.exp(-clickPhase);
                    if (head) {
                        head.rotation.x = nod;
                    }
                    // Bounce
                    model.position.y = modelBaseY + Math.abs(Math.sin(clickPhase * 3)) * 0.1 * Math.exp(-clickPhase);
                }
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContact3D);
    } else {
        initContact3D();
    }
})();
