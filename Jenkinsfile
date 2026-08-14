pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/genieselenium/NinjaTesters_PlaywrightCRM.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci --no-audit'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                allure([
                    includeProperties: false,
                    jdk: '',
                    properties: [],
                    reportBuildPolicy: 'ALWAYS',
                    results: [
                        [path: 'allure-results']
                    ]
                ])
            }
        }
    }

    post {
        always {
            echo 'Test execution completed.'
            script {
                echo "Build result before post actions: ${currentBuild.result}"
            }
        }

        success {
            echo 'All tests passed!'
        }

        unstable {
            echo 'Build marked UNSTABLE — check the Jenkins console output.'
        }

        failure {
            echo 'Some tests failed.'
        }
    }
}