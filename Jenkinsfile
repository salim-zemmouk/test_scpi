node("ci-node") {
    def GIT_COMMIT_HASH = ""

    stage("Clean workspace") {
        sh "sudo rm -rf cypress node_modules package-lock.json || true"
    }

    stage("Checkout") {
        checkout scm
        GIT_COMMIT_HASH = sh(script: "git log -n 1 --pretty=format:'%H'", returnStdout: true).trim()
    }

    stage("Install dependencies") {
        sh "npm install"
        sh "npm install --save-dev cypress-mochawesome-reporter mochawesome mochawesome-merge mochawesome-report-generator"
    }

    stage("Run Cypress Tests") {
        withCredentials([usernamePassword(credentialsId: 'mchekini', passwordVariable: 'PASSWORD', usernameVariable: 'USERNAME')]) {
            script {
                try {
                    sh '''
                        sudo docker run --rm --pull always \
                          -u $(id -u):$(id -g) \
                          -e USERNAME=$USERNAME \
                          -e PASSWORD=$PASSWORD \
                          -v $(pwd):/app \
                          -w /app \
                          cypress/included:14.2.1 npm run test
                    '''
                } catch (Exception e) {
                    echo "Une erreur s'est produite lors du lancement des tests e2e"
                }
            }
        }
    }

    stage("Archive Test Report") {
        archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true

        publishHTML([
            allowMissing: false,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: 'cypress/reports/html',
            reportFiles: 'index.html',
            reportName: 'HTML Report'
        ])
    }
}
