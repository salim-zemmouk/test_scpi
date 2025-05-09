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
        sh "npm ci"
        sh "npm install --save-dev cypress-mochawesome-reporter mochawesome mochawesome-merge mochawesome-report-generator"
    }

    stage("Docker Login") {
        withCredentials([usernamePassword(credentialsId: 'mchekini', passwordVariable: 'password', usernameVariable: 'username')]) {
            sh 'sudo docker login -u "$username" -p "$password"'
        }
    }

    def testFailed = false

    stage("Run Cypress Tests") {
        withCredentials([usernamePassword(credentialsId: 'mchekini', passwordVariable: 'password', usernameVariable: 'username')]) {
            script {
                try {
                    sh '''
                      #!/bin/bash
                      set +e
                      sudo docker run --rm --pull always \
                        -u $(id -u):$(id -g) \
                        -e USERNAME=$USERNAME \
                        -e PASSWORD=$PASSWORD \
                        -v $(pwd):/e2e \
                        -w /e2e \
                        cypress/included:14.2.1
                      echo $? > test_exit_code.txt
                    '''
                    def exitCode = sh(script: "cat test_exit_code.txt", returnStdout: true).trim()
                    if (exitCode != "0") {
                        testFailed = true
                        echo "Les tests Cypress ont échoué (exit code ${exitCode})."
                    } else {
                        echo "Les tests Cypress ont réussi."
                    }
                } catch (Exception e) {
                    echo "Erreur pendant l'exécution des tests : ${e.getMessage()}"
                    testFailed = true
                }
            }
        }
    }

    stage('Generate HTML Report') {
        when {
            expression { return testFailed }
        }
        steps {
            sh '''
                npx mochawesome-merge cypress/reports/html/jsons/*.json > cypress/reports/html/mochawesome.json
                npx marge cypress/reports/html/mochawesome.json --reportDir cypress/reports/html --reportFilename index
            '''
        }
    }

    stage("Archive Test Report") {
        when {
            expression { return testFailed }
        }
        steps {
            archiveArtifacts artifacts: 'cypress/reports/html/index.html', allowEmptyArchive: false
        }
    }

    stage("Archive Screenshots") {
        when {
            expression { return testFailed }
        }
        steps {
            archiveArtifacts artifacts: 'cypress/screenshots/**/*.png', allowEmptyArchive: true
        }
    }
}