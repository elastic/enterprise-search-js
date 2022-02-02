#!/usr/bin/env bash
#
export TEST_SUITE=platinum
export CONTAINER_NAME=enterprise-search

script_path=$(dirname $(realpath -s $0))
source $script_path/functions/imports.sh
set -euo pipefail

echo -e "\033[1m>>>>> Start [$STACK_VERSION container] >>>>>>>>>>>>>>>>>>>>>>>>>>>>>\033[0m"
DETACH=true bash .ci/run-elasticsearch.sh

echo -e "\033[1m>>>>> Running run-enterprise-search.sh >>>>>>>>>>>>>>>>>>>>>>>>>>>>>\033[0m"
bash .ci/run-enterprise-search.sh
