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

    stage("Docker Login") {
        withCredentials([usernamePassword(credentialsId: 'mchekini', passwordVariable: 'password', usernameVariable: 'username')]) {
            sh 'sudo docker login -u "$username" -p "$password"'
        }
    }

    stage("Run Cypress Tests") {
        withCredentials([usernamePassword(credentialsId: 'mchekini', passwordVariable: 'password', usernameVariable: 'username')]) {
            script {
                try {
                    sh '''
                      #!/bin/bash
                      sudo docker run --rm --pull always \
                        -u $(id -u):$(id -g) \
                        -e USERNAME=$username \
                        -e PASSWORD=$password \
                        -v $(pwd):/e2e \
                        -w /e2e \
                        cypress/included:14.2.1
                    '''
                } catch (Exception e) {
                    echo "Une erreur s'est produite lors de l'exécution des tests E2E : ${e.getMessage()}"
                }
            }
        }
    }
stage('Generate HTML Report') {
    sh '''
        npm install --save-dev mochawesome mochawesome-merge mochawesome-report-generator
        chmod +x scripts/posttest.sh
        scripts/posttest.sh
    '''
}


    stage("Archive Screenshots") {
        archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
    }
}