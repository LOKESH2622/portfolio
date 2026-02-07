// ==================== 3D HERO MODEL WITH MOUSE TRACKING ====================

(function() {
    'use strict';
    
    // Wait for DOM and components to load
    function initHero3D() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) {
            // Canvas not ready yet, try again later
            setTimeout(initHero3D, 100);
            return;
        }
        
        // Scene setup
        const scene = new THREE.Scene();
        
        // Get container dimensions
        const container = canvas.parentElement;
        const width = container.clientWidth || 500;
        const height = container.clientHeight || 500;
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);
        
        // Renderer setup
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
        renderer.toneMappingExposure = 1.5;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);
        
        const pointLight1 = new THREE.PointLight(0x9370db, 1, 100);
        pointLight1.position.set(-5, 5, 5);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x1ee6d2, 0.8, 100);
        pointLight2.position.set(5, -5, 5);
        scene.add(pointLight2);
        
        // Mouse tracking variables
        let mouseX = 0;
        let mouseY = 0;
        let model = null;
        let eyes = [];
        let eyeTargetX = 0;
        let eyeTargetY = 0;
        
        // Load the GLB model
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            'src/assets/robo_bomb.glb',
            function(gltf) {
                model = gltf.scene;
                
                // Remove box/cube meshes and find eyes
                const meshesToRemove = [];
                
                model.traverse(function(child) {
                    if (child.isMesh) {
                        const name = child.name.toLowerCase();
                        
                        // Log mesh names for debugging
                        console.log('Found mesh:', child.name);
                        
                        // Remove box/cube/container meshes
                        if (name.includes('box') || name.includes('cube') || 
                            name.includes('container') || name.includes('platform') ||
                            name.includes('base') || name.includes('ground')) {
                            meshesToRemove.push(child);
                        }
                        
                        // Find eye meshes
                        if (name.includes('eye') || name.includes('pupil') || 
                            name.includes('iris') || name.includes('lens')) {
                            eyes.push(child);
                            console.log('Found eye:', child.name);
                        }
                    }
                });
                
                // Remove unwanted meshes
                meshesToRemove.forEach(function(mesh) {
                    console.log('Removing:', mesh.name);
                    mesh.visible = false;
                    if (mesh.parent) {
                        mesh.parent.remove(mesh);
                    }
                });
                
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // Center the model
                model.position.sub(center);
                
                // Scale to fit viewport
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2.5 / maxDim;
                model.scale.setScalar(scale);
                
                scene.add(model);
                
                console.log('Robo Bomb model loaded successfully!');
                console.log('Eyes found:', eyes.length);
            },
            function(xhr) {
                // Loading progress
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                console.log('Loading model: ' + Math.round(percentComplete) + '%');
            },
            function(error) {
                console.error('Error loading model:', error);
            }
        );
        
        // Mouse move handler
        function onMouseMove(event) {
            // Calculate mouse position relative to window center (-1 to 1)
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        }
        
        // Touch move handler for mobile
        function onTouchMove(event) {
            if (event.touches.length > 0) {
                mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
                mouseY = (event.touches[0].clientY / window.innerHeight) * 2 - 1;
            }
        }
        
        // Add event listeners
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('touchmove', onTouchMove, { passive: true });
        
        // Handle window resize
        function onWindowResize() {
            const newWidth = container.clientWidth || 500;
            const newHeight = container.clientHeight || 500;
            
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        }
        
        window.addEventListener('resize', onWindowResize, false);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Faster, more responsive tracking towards mouse
            eyeTargetX += (mouseX - eyeTargetX) * 0.1;
            eyeTargetY += (mouseY - eyeTargetY) * 0.1;
            
            if (model) {
                // Model looks directly at cursor position
                // Increased rotation range for more dramatic look-at effect
                model.rotation.y = eyeTargetX * Math.PI * 0.6;
                model.rotation.x = eyeTargetY * Math.PI * 0.5;
                
                // Add subtle floating animation
                model.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            }
            
            // Make eyes look at cursor even more intensely
            if (eyes.length > 0) {
                eyes.forEach(function(eye) {
                    // Eyes track mouse more dramatically
                    eye.rotation.y = eyeTargetX * Math.PI * 0.8;
                    eye.rotation.x = eyeTargetY * Math.PI * 0.6;
                });
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(initHero3D, 500);
        });
    } else {
        setTimeout(initHero3D, 500);
    }
})();
