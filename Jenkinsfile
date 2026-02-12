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
                script {
                    docker.build("deploysafe-portfolio:latest")
                }
            }
        }

        stage('Test Container') {
            steps {
                bat 'docker run -d --name deploysafe-test -p 3001:3000 deploysafe-portfolio:latest'
                bat 'timeout /t 5'
                bat 'docker stop deploysafe-test'
                bat 'docker rm deploysafe-test'
            }
        }
    }
}
