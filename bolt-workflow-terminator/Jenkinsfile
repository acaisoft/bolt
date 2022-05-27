#!groovy
import org.jenkinsci.plugins.pipeline.modeldefinition.Utils

properties(
        [[$class  : 'BuildDiscarderProperty',
          strategy: [$class: 'LogRotator', artifactDaysToKeepStr: '15', artifactNumToKeepStr: '15', daysToKeepStr: '15', numToKeepStr: '15']]])


def DOCKER_REPOSITORY = "eu.gcr.io/acai-bolt/bolt-workflow-terminator"
def GCR_CREDENTIALS = "acai-bolt-gcp-private-key"
def DEV_BRANCH = "master"
def DEV_LITE_BRANCH = "dev-lite"
def PROD_BRANCH = "prod"
def GCR_URL = "https://eu.gcr.io"

node('docker') {
    env.COMPOSE_INTERACTIVE_NO_CLI = 1
    env.HOME = "${WORKSPACE}"

    def version = ''
    def errorMessage = ''

    try {
        stage('Clear workspace') {
            sh "printenv"
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

        stage('Build image') {
            if (env.BRANCH_NAME != DEV_BRANCH && env.BRANCH_NAME != PROD_BRANCH && env.BRANCH_NAME != DEV_LITE_BRANCH) {
                Utils.markStageSkippedForConditional('Build image')
                return;
            }
            sh "docker build --build-arg release=${version} -t ${DOCKER_REPOSITORY}:${version} ."
        }

        stage('Push image') {
            if (env.BRANCH_NAME != DEV_BRANCH && env.BRANCH_NAME != PROD_BRANCH && env.BRANCH_NAME != DEV_LITE_BRANCH) {
                Utils.markStageSkippedForConditional('Push image')
                return;
            }
            docker.withRegistry("${GCR_URL}", "gcr:${GCR_CREDENTIALS}") {
                sh "ln -s /home/acaisoft/.dockercfg ${env.HOME}/.dockercfg"
                sh "docker push ${DOCKER_REPOSITORY}:${version}"
            }
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