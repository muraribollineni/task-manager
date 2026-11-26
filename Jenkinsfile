
pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code'
                checkout scm
            }
        }

        stage('Verify Files') {
            steps {
                bat 'dir'
            }
        }

        stage('Check Git') {
            steps {
                bat 'git --version'
            }
        }
    }

    post {
        success {
            echo 'GitHub checkout successful!'
        }
        failure {
            echo 'GitHub checkout failed!'
        }
    }
}
