pipeline {
    agent { label "ci-node" }

    environment {
        GIT_COMMIT_HASH = ""
    }

    stages {
        stage("Checkout") {
            steps {
                checkout scm
                script {
                    GIT_COMMIT_HASH = sh(script: "git log -n 1 --pretty=format:'%H'", returnStdout: true).trim()
                }
            }
        }

        stage("Install dependencies") {
            steps {
                sh "npm install"
                sh "npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator cypress-mochawesome-reporter"
            }
        }

        stage("Run Cypress Tests") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'mchekini', passwordVariable: 'password', usernameVariable: 'username')]) {
                    sh """
                        sudo docker run --rm --pull always \\
                          -u \$(id -u):\$(id -g) \\
                          -e USERNAME=$username \\
                          -e PASSWORD=$password \\
                          -v \$(pwd):/app \\
                          -w /app \\
                          cypress/included:14.2.1 npm run test
                    """
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true

            publishHTML([
                reportDir: 'cypress/reports/html',
                reportFiles: 'mochawesome.html',
                reportName: 'Cypress HTML Report',
                keepAll: true,
                alwaysLinkToLastBuild: true,
                allowMissing: true
            ])
        }
    }
}
