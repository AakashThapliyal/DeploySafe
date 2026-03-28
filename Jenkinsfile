pipeline {
    agent any

    environment {
        IMAGE_NAME = "deploysafe-portfolio"
        CONTAINER_NAME = "deploysafe-test"
        DEPLOY_CONTAINER = "deploysafe-prod"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        bat "${scannerHome}\\bin\\sonar-scanner.bat"
                    }
                }
            }
        }

        stage('OWASP Dependency Check') {
            steps {
                script {
                    def odcHome = tool 'DependencyCheck'
                    bat "${odcHome}\\bin\\dependency-check.bat --scan . --format XML --out ."
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE_NAME%:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                    bat "docker tag %IMAGE_NAME%:latest %DOCKER_USER%/%IMAGE_NAME%:latest"
                    bat "docker tag %IMAGE_NAME%:latest %DOCKER_USER%/%IMAGE_NAME%:build-%BUILD_NUMBER%"
                    bat "docker push %DOCKER_USER%/%IMAGE_NAME%:latest"
                    bat "docker push %DOCKER_USER%/%IMAGE_NAME%:build-%BUILD_NUMBER%"
                    echo "✅ Image pushed to Docker Hub as build-%BUILD_NUMBER%"
                }
            }
        }

        stage('Trivy Security Scan') {
            steps {
                script {
                    def status = bat(
                        script: "trivy image --ignore-unfixed --severity CRITICAL %IMAGE_NAME%:latest",
                        returnStatus: true
                    )

                    if (status != 0) {
                        error "❌ Critical vulnerabilities found! Failing pipeline."
                    } else {
                        echo "✅ No CRITICAL vulnerabilities found."
                    }
                }
            }
        }

        stage('Cleanup Old Test Container') {
            steps {
                script {
                    bat(script: "docker stop %CONTAINER_NAME%", returnStatus: true)
                    bat(script: "docker rm %CONTAINER_NAME%", returnStatus: true)
                    echo "Old test container cleanup attempted."
                }
            }
        }

        stage('Run Test Container') {
            steps {
                bat "docker run -d --name %CONTAINER_NAME% -p 3002:3000 %IMAGE_NAME%:latest"
                bat 'ping 127.0.0.1 -n 6 > nul'
                script {
                    def response = bat(
                        script: 'curl -s -o nul -w "%%{http_code}" http://localhost:3002/health',
                        returnStdout: true
                    ).trim()

                    if (response == '200') {
                        echo "✅ Health check passed — app is responding with HTTP 200."
                    } else {
                        error "❌ Health check failed — got HTTP ${response} instead of 200."
                    }
                }
            }
        }
        
        stage('Stop Test Container') {
            steps {
                bat(script: "docker stop %CONTAINER_NAME%", returnStatus: true)
                bat(script: "docker rm %CONTAINER_NAME%", returnStatus: true)
                echo "Test container removed."
            }
        }

        stage('Deploy Locally') {
            steps {
                script {
                    // Stop old production container if exists
                    bat(script: "docker stop %DEPLOY_CONTAINER%", returnStatus: true)
                    bat(script: "docker rm %DEPLOY_CONTAINER%", returnStatus: true)

                    // Run production container permanently
                    bat "docker run -d --restart unless-stopped --name %DEPLOY_CONTAINER% -p 3001:3000 %IMAGE_NAME%:latest"

                    echo "🚀 Resume Page Deployed Successfully at http://localhost:3001"
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed."
        }

        success {
            echo "🎉 Secure Deployment Successful!"
        }

        failure {
            echo "❌ Build Failed — Security Gate Blocked Deployment."
        }
    }
}
