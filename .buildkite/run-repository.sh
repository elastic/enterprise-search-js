#!/usr/bin/env bash
#
# Called by entry point `run-test` use this script to add your repository specific test commands
#
# Once called Elasticsearch is up and running
#
# Its recommended to call `imports.sh` as defined here so that you get access to all variables defined there
#
# Any parameters that test-matrix.yml defines should be declared here with appropiate defaults

script_path=$(dirname $(realpath -s $0))
source $script_path/functions/imports.sh
set -euo pipefail

echo -e "\033[34;1mINFO:\033[0m VERSION: ${STACK_VERSION}\033[0m"
echo -e "\033[34;1mINFO:\033[0m TEST_SUITE: ${TEST_SUITE}\033[0m"
echo -e "\033[34;1mINFO:\033[0m NODE_JS_VERSION: ${NODE_JS_VERSION}\033[0m"
echo -e "\033[34;1mINFO:\033[0m RUNSCRIPTS: ${RUNSCRIPTS}\033[0m"
echo -e "\033[34;1mINFO:\033[0m URL: ${elasticsearch_url}\033[0m"
echo -e "\033[34;1mINFO:\033[0m SERVICE: ${SERVICE}\033[0m"

echo -e "\033[34;1mINFO:\033[0m pinging Elasticsearch ..\033[0m"
curl --insecure --fail $external_elasticsearch_url/_cluster/health?pretty

if [[ "$RUNSCRIPTS" = *"enterprise-search"* ]]; then
  enterprise_search_url="http://localhost:3002"
  echo -e "\033[34;1mINFO:\033[0m pinging Enterprise Search ..\033[0m"
  curl -I --fail $enterprise_search_url
fi

echo -e "\033[32;1mSUCCESS:\033[0m successfully started the ${STACK_VERSION} stack.\033[0m"

echo -e "\033[32;1mBUILD: \033[31mJS \e[0m container.\033[0m"

docker build \
       --file .buildkite/Dockerfile \
       --tag elastic/enterprise-search-js \
       --build-arg NODE_JS_VERSION=${NODE_JS_VERSION} \
       .

echo -e "\033[32;1mRUN: \033[31mJS \e[0m container.\033[0m"

docker run \
       --network ${network_name} \
       --name enterprise-search-js \
       --env "ENTERPRISE_SEARCH_URL=http://${CONTAINER_NAME}:3002" \
       --rm \
       --volume `pwd`:/code/enterprise-search-js \
       elastic/enterprise-search-js \
       npm run test:integration --prefix packages/enterprise-search
