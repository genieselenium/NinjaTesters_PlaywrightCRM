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
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'SUCCESS') {
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
    }

    post {
        always {
            echo 'Test execution completed.'
        }

        success {
            echo 'All tests passed!'
        }

        failure {
            echo 'Some tests failed.'
        }
    }
}