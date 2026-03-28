pipeline {
    agent any

    environment {
        IMAGE_NAME = "deploysafe-portfolio"
        DOCKERHUB_USER = "your-dockerhub-username"
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

        stage('Tag & Push to DockerHub') {
            steps {
                script {
                    bat "docker tag %IMAGE_NAME%:latest %DOCKERHUB_USER%/%IMAGE_NAME%:latest"
                    bat "docker push %DOCKERHUB_USER%/%IMAGE_NAME%:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f deployment.yaml'
                bat 'kubectl apply -f service.yaml'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods'
                bat 'kubectl get services'
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed."
        }

        success {
            echo "🎉 Kubernetes Deployment Successful!"
        }

        failure {
            echo "❌ Build Failed — Security Gate Blocked Deployment."
        }
    }
}