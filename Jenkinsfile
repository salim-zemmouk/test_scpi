node("ci-node") {
    def GIT_COMMIT_HASH = ""

    stage("Checkout") {
        checkout scm
        GIT_COMMIT_HASH = sh(script: "git log -n 1 --pretty=format:'%H'", returnStdout: true).trim()
    }

    stage("Install dependencies") {
        sh "npm install"
    }

    stage("Run Cypress Tests") {
        withCredentials([
            usernamePassword(credentialsId: 'mchekini', usernameVariable: 'username', passwordVariable: 'password')
        ]) {
            sh """
                sudo docker run --rm --pull always \
                  -e USERNAME=$username \
                  -e PASSWORD=$password \
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
