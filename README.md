# DeploySafe 🚀
### A Cloud-Native DevSecOps CI/CD Pipeline for Secure Application Deployment

![Jenkins](https://img.shields.io/badge/Jenkins-Pipeline-orange?logo=jenkins)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![SonarQube](https://img.shields.io/badge/SonarQube-Quality%20Gate-brightgreen?logo=sonarqube)
![Trivy](https://img.shields.io/badge/Trivy-Security%20Scan-red)
![OWASP](https://img.shields.io/badge/OWASP-Dependency%20Check-yellow)

---

## 📌 Project Overview

DeploySafe is a fully automated **DevSecOps CI/CD pipeline** built as a major academic project for MCA (Cloud Computing & DevOps) at Chandigarh University.

The pipeline integrates **security at every stage** of the software delivery lifecycle — from code quality analysis and dependency scanning to container image vulnerability checks — before deploying a containerized Node.js application locally via Docker.

---

## 🏗️ Architecture
```
Developer → GitHub → Jenkins Pipeline
                          │
              ┌───────────┼────────────────────────┐
              │           │                        │
         SonarQube    OWASP DC               Docker Build
         (SAST)      (SCA)                       │
                                            Docker Hub Push
                                                 │
                                          Trivy Image Scan
                                                 │
                                       ┌─────────┴──────────┐
                                  Test Container        Health Check
                                  (port 3002)           (curl /health)
                                       │
                                  Prod Container
                                  (port 3001)
                                       │
                                Discord Notification
```

---

## 🔧 Tech Stack

| Tool | Purpose |
|------|---------|
| Jenkins | CI/CD Orchestration |
| Docker | Containerization & Image Registry |
| Docker Hub | Remote Image Storage |
| SonarQube | Static Application Security Testing (SAST) |
| OWASP Dependency Check | Software Composition Analysis (SCA) |
| Trivy | Container Image Vulnerability Scanning |
| Node.js + Express | Application Runtime |
| Discord Webhook | Build Notifications |

---

## 🔒 Security Stages

1. **SonarQube Analysis** — Scans source code for bugs, code smells, and security vulnerabilities. Pipeline fails if quality gate is not passed.
2. **OWASP Dependency Check** — Scans all npm dependencies against the NVD CVE database for known vulnerabilities.
3. **Trivy Image Scan** — Scans the built Docker image for CRITICAL vulnerabilities. Pipeline fails if any are found, blocking deployment.

---

## 🚀 Pipeline Stages

| Stage | Description |
|-------|-------------|
| Checkout Code | Pulls latest code from GitHub |
| SonarQube Analysis | SAST scan + quality gate |
| OWASP Dependency Check | Dependency CVE scan |
| Build Docker Image | Builds container image |
| Push to Docker Hub | Pushes `latest` + versioned `build-N` tags |
| Trivy Security Scan | Image vulnerability check |
| Cleanup Old Test Container | Removes previous test container |
| Run Test Container | Starts app on port 3002 |
| Health Check | Validates `/health` endpoint returns HTTP 200 |
| Stop Test Container | Removes test container |
| Deploy Locally | Runs production container on port 3001 |
| Notifications | Sends build result to Discord |

---

## 📁 Project Structure
```
deploysafe-portfolio/
├── public/
│   ├── index.html        # Portfolio frontend
│   └── style.css
├── app.js                # Express server
├── Dockerfile            # Container definition
├── Jenkinsfile           # Full CI/CD pipeline
├── sonar-project.properties  # SonarQube config
├── package.json
└── README.md
```

---

## ⚙️ Prerequisites

- Jenkins (with plugins: Pipeline, Docker Pipeline, SonarQube Scanner, OWASP Dependency Check, NodeJS)
- Docker Desktop
- Trivy installed on Jenkins agent
- SonarQube server running locally
- Docker Hub account

---

## 🐳 Docker Hub

Image is automatically pushed to Docker Hub on every successful build:
```
docker pull aakash22sharma/deploysafe-portfolio:latest
docker pull aakash22sharma/deploysafe-portfolio:build-<N>
```

---

## ▶️ Running the Project (Demo)

1. Start required services:
   - Jenkins
   - Docker Desktop
   - SonarQube

2. Open Jenkins:
   http://localhost:8080

3. Click:
   → DeploySafe-The_Project_Pipeline  
   → Build Now

4. After successful build:
   Open:
   http://localhost:3001



## 👨‍💻 Author

**Aakash Thapliyal**
MCA — Cloud Computing & DevOps
Chandigarh University
GitHub: [AakashThapliyal](https://github.com/AakashThapliyal)