pipeline {
    agent any

    environment {
        IMAGE_NAME = "deploysafe-portfolio"
        CONTAINER_NAME = "deploysafe-test"
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

        stage('Trivy Scan') {
            steps {
                bat 'trivy image --ignore-unfixed --exit-code 1 --severity CRITICAL deploysafe-portfolio'
            }
        }


        stage('Cleanup Old Container') {
            steps {
                bat '''
                docker stop %CONTAINER_NAME% 2>nul
                docker rm %CONTAINER_NAME% 2>nul
                '''
            }
        }

        stage('Run Test Container') {
            steps {
                bat "docker run -d --name %CONTAINER_NAME% -p 3001:3000 %IMAGE_NAME%:latest"
                bat 'ping 127.0.0.1 -n 6 > nul'
            }
        }

        stage('Stop & Remove Container') {
            steps {
                bat '''
                docker stop %CONTAINER_NAME%
                docker rm %CONTAINER_NAME%
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed."
        }

        success {
            echo "Deployment Successful ✅"
        }

        failure {
            echo "Build Failed ❌ — Check security reports."
        }
    }
}

