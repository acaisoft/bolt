#!groovy

properties(
        [[$class  : 'BuildDiscarderProperty',
          strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '15', artifactNumToKeepStr: '15', daysToKeepStr: '15', numToKeepStr: '15']]])

def DEV_BRANCH = "master"
def DEV_LITE_BRANCH = "dev-lite"
def PROD_BRANCH = "prod"
def FIREBASE_CI_TOKEN = "bolt-firebase-token"

node('docker') {

    def version = ''

    try {

        stage('Clear workspace') {
            deleteDir()
        }

        stage('Checkout') {
            retry(3) {
                checkout scm
            }

            version = sh returnStdout: true, script: 'git describe --long --dirty --abbrev=10 --tags --always'
            version = env.BRANCH_NAME + "-" + version.replaceAll("\\s+", "")
            echo "Version: ${version}"
        }

        stage('Build') {

          def stage

          if (env.BRANCH_NAME == PROD_BRANCH) {
              stage = "prod"
          }
          if (env.BRANCH_NAME == DEV_BRANCH) {
              stage = "stage"
          }
          if (env.BRANCH_NAME == DEV_LITE_BRANCH) {
              stage = "dev-lite"
          }

            docker.image('node:8.12').inside() {
                sh "yarn"
                sh "REACT_APP_STAGE=${stage} REACT_APP_VERSION=${version} yarn build"
            }
        }

        stage('Test') {
            docker.image('node:8.12').inside() {
                sh "CI=true yarn test"
            }
        }


        stage('Deploy') {

            if (env.BRANCH_NAME == DEV_BRANCH) {
                echo "Deploy to dev"
                withCredentials([string(credentialsId: FIREBASE_CI_TOKEN, variable: 'TOKEN')]) {
                    docker.image('node:10.20-alpine').inside("-u root") {
                        sh "npm install -g firebase-tools"
                        sh "firebase deploy --non-interactive --token ${TOKEN} --only hosting:acai-bolt"
                    }
                }
                return;
            }

            if (env.BRANCH_NAME == PROD_BRANCH) {
                echo "Deploy to prod"
                withCredentials([string(credentialsId: FIREBASE_CI_TOKEN, variable: 'TOKEN')]) {
                    docker.image('node:10.20-alpine').inside("-u root") {
                        sh "npm install -g firebase-tools"
                        sh "firebase deploy --non-interactive --token ${TOKEN} --only hosting:acai-bolt-prod"
                    }
                }

                return;
            }

            if (env.BRANCH_NAME == DEV_LITE_BRANCH) {
                echo "Deploy to prod"
                withCredentials([string(credentialsId: FIREBASE_CI_TOKEN, variable: 'TOKEN')]) {
                    docker.image('node:10.20-alpine').inside("-u root") {
                        sh "npm install -g firebase-tools"
                        sh "firebase deploy --non-interactive --token ${TOKEN} --only hosting:acai-bolt-lite"
                    }
                }

                return;
            }
            echo "Skipping. Runs only for ${DEV_BRANCH}, ${PROD_BRANCH} and ${DEV_LITE_BRANCH} branches"
        }
    }
    catch (ex) {
        currentBuild.result = "FAILED"
        errorMessage = ex.getMessage()
        throw ex
    }
    finally {
        stage('Clean up') {
            cleanWs()
        }
    }
}
