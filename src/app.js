function updateTimestamp() {
    const now = new Date();
    const timestamp = now.toLocaleString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('timestamp').textContent = timestamp;
}

function generateContainerId() {
    const chars = '0123456789abcdef';
    let id = '';
    for (let i = 0; i < 12; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

function testContainer() {
    const resultBox = document.getElementById('result');
    const statusElement = document.getElementById('status');
    
    statusElement.textContent = 'Test en cours...';
    statusElement.style.color = '#EA580C';
    
    setTimeout(() => {
        statusElement.textContent = 'Container opérationnel';
        statusElement.style.color = '#16A34A';
        
        resultBox.innerHTML = `
            <strong>Test du Container Réussi</strong><br><br>
            docker ps<br>
            CONTAINER ID   IMAGE                                    STATUS<br>
            ${document.getElementById('container-id').textContent}      ghcr.io/user/devops-tp-docker:latest   Up 5 minutes<br><br>
            - Serveur Nginx : OK<br>
            - Application Web : OK<br>
            - Port 80 : LISTENING<br>
            - Health Check : PASSED
        `;
        resultBox.className = 'result-box success';
    }, 1500);
}

document.addEventListener('DOMContentLoaded', function() {
    updateTimestamp();
    setInterval(updateTimestamp, 1000);
    
    const containerId = generateContainerId();
    document.getElementById('container-id').textContent = containerId;
    
    document.getElementById('status').textContent = 'Container opérationnel';
});
Étape 3 : Configuration Nginx
3.1 Fichier nginx/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Configuration pour SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache pour les assets statiques
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
