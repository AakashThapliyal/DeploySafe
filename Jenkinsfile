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
                sh 'docker run -d -p 3001:3000 deploysafe-portfolio:latest'
                sleep 5
                sh 'docker stop $(docker ps -q)'
            }
        }
    }
}
