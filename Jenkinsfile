node("ci-node") {
    def GIT_COMMIT_HASH = ""

    stage("Checkout") {
        checkout scm
        GIT_COMMIT_HASH = sh(script: "git log -n 1 --pretty=format:'%H'", returnStdout: true).trim()
    }

    stage("Install dependencies") {
        sh "npm install"
    }

    stage("Run Cypress Tests in Docker") {
        withCredentials([
            usernamePassword(credentialsId: 'cypress-username', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
        ]) {
            sh """
                docker run --rm \
                  -e USERNAME=$USERNAME \
                  -e PASSWORD=$PASSWORD \
                  -v \$(pwd)/cypress/screenshots:/app/cypress/screenshots \
                  -v \$(pwd):/app \
                  -w /app \
                  cypress/included:14.2.1 npm run test
            """
        }
    }

    stage("Archive Screenshots") {
        archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
    }
}
