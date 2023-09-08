#!/usr/bin/env bash
#
export TEST_SUITE=platinum
export CONTAINER_NAME=enterprise-search

script_path=$(dirname $(realpath -s $0))
source $script_path/functions/imports.sh
set -euo pipefail

echo -e "--- :elasticsearch: Start $STACK_VERSION container"
DETACH=true bash .buildkite/run-elasticsearch.sh

echo -e "--- Run run-enterprise-search.sh"
bash .buildkite/run-enterprise-search.sh
