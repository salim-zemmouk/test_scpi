node("ci-node") {
    def GIT_COMMIT_HASH = ""

    stage("Cleanup Workspace") {
        sh 'sudo rm -rf * || true'
    }

    stage("Checkout") {
        checkout scm
        GIT_COMMIT_HASH = sh(script: "git log -n 1 --pretty=format:'%H'", returnStdout: true).trim()
    }

    stage("Install dependencies") {
        sh "npm install"
        sh "npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator cypress-mochawesome-reporter"
    }

    stage("Run Cypress Tests") {
        withCredentials([usernamePassword(credentialsId: 'mchekini', passwordVariable: 'password', usernameVariable: 'username')]) {
            sh """
                sudo docker run --rm --pull always \\
                  -e USERNAME=$username \\
                  -e PASSWORD=$password \\
                  -v \$(pwd):/app \\
                  -w /app \\
                  cypress/included:14.2.1 npm run test
            """
        }
    }
}

post {
    always {
       // archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true

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
