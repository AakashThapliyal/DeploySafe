pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t deploysafe-portfolio:latest .'
            }
        }

        stage('Cleanup Old Container') {
            steps {
                bat '''
                docker stop deploysafe-test 2>nul
                docker rm deploysafe-test 2>nul
                '''
            }
        }

        stage('Run Test Container') {
            steps {
                bat 'docker run -d --name deploysafe-test -p 3001:3000 deploysafe-portfolio:latest'
                bat 'ping 127.0.0.1 -n 6 > nul'
            }
        }

        stage('Stop & Remove Container') {
            steps {
                bat '''
                docker stop deploysafe-test
                docker rm deploysafe-test
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline execution completed."
        }
    }
}
