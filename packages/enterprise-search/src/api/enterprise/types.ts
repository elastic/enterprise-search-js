/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-interface */

// This file was automatically generated by elastic/elastic-client-generator-js
// DO NOT MODIFY IT BY HAND. Instead, modify the source open api file,
// and elastic/elastic-client-generator-js to regenerate this file again.

export interface GetHealthRequest {}

export interface GetHealthResponse {
  name: string
  cluster_uuid: string
  version: {
    number: string
    build_hash: string
    build_date: string
  }
  jvm: {
    pid: number
    uptime: number
    memory_usage: {
      heap_init: number
      heap_used: number
      heap_committed: number
      heap_max: number
      non_heap_init: number
      non_heap_committed: number
      object_pending_finalization_count: number
    }
    memory_pools: string[]
    threads: {
      thread_count: number
      peak_thread_count: number
      total_started_thread_count: number
      daemon_thread_count: number
    }
    vm_version: string
    vm_vendor: string
    vm_name: string
    gc: {
      collection_count: number
      collection_time: number
      garbage_collectors: {
        [k: string]: {
          collection_count?: number
          collection_time?: number
        }
      }
    }
  }
  filebeat: {
    pid?: number
    alive: boolean
    restart_count?: number
    seconds_since_last_restart?: number
  }
  metricbeat?: {
    pid?: number
    alive: boolean
    restart_count?: number
    seconds_since_last_restart?: number
  }
  system: {
    java_version: string
    jruby_version: string
    os_name: string
    os_version: string
  }
  esqueues_me?: {
    [k: string]: unknown
  }
  crawler?: {
    running: boolean
    workers: {
      pool_size: number
      active: number
      available: number
    }
  }
}

export interface GetReadOnlyRequest {}

export interface GetReadOnlyResponse {
  enabled: boolean
}

export interface PutReadOnlyRequest {
  body: {
    enabled: boolean
  }
}

export interface PutReadOnlyResponse {
  enabled: boolean
}

export interface GetStatsRequest {
  /**
   * Comma-separated list of stats to return
   */
  include?: string[]
}

export interface GetStatsResponse {
  cluster_uuid: string
  http: {
    connections: {
      current: number
      max: number
      total: number
    }
    request_duration_ms: {
      max: number
      mean: number
      std_dev: number
    }
    network_bytes: {
      received_total: number
      received_rate: number
      sent_total: number
      sent_rate: number
    }
    responses: {
      '1xx': number
      '2xx': number
      '3xx': number
      '4xx': number
      '5xx': number
    }
  }
  app: {
    pid: number
    start: string
    end: string
    metrics: {
      [k: string]:
        | number
        | {
            sum: number
            max: number
            mean: number
          }
    }
  }
  queues: {
    [k: string]: unknown
  }
  connectors: {
    alive: boolean
    pool: {
      extract_worker_pool: {
        running: boolean
        queue_depth: number
        size: number
        busy: number
        idle: number
        total_scheduled: number
        total_completed: number
      }
      subextract_worker_pool: {
        running: boolean
        queue_depth: number
        size: number
        busy: number
        idle: number
        total_scheduled: number
        total_completed: number
      }
      publish_worker_pool: {
        running: boolean
        queue_depth: number
        size: number
        busy: number
        idle: number
        total_scheduled: number
        total_completed: number
      }
    }
    job_store: {
      waiting: number
      working: number
      job_types: {
        full: number
        incremental: number
        delete: number
        permissions: number
      }
    }
  }
  crawler?: {
    global: {
      crawl_requests: {
        pending: number
        active: number
        successful: number
        failed: number
      }
    }
    node: {
      active_threads: number
      pages_visited: number
      urls_allowed: number
      queue_size: {
        primary: number
        purge: number
      }
      urls_denied: {
        [k: string]: number
      }
      status_codes: {
        [k: string]: number
      }
      workers: {
        pool_size: number
        active: number
        available: number
      }
    }
  }
  product_usage?: {
    app_search: {
      total_engines: number
    }
    workplace_search: {
      total_org_sources: number
      total_private_sources: number
      total_queries_last_30_days: number
    }
    enterprise_search: {
      total_search_indices: number
    }
  }
}

export interface GetStorageRequest {}

export interface GetStorageResponse {
  indices: {
    name: string
    size_in_bytes: number
  }[]
  summary: {
    index_count: number
    size_in_bytes: number
  }
}

export interface GetStaleStorageRequest {}

export interface GetStaleStorageResponse {
  indices: {
    name: string
    size_in_bytes: number
  }[]
  summary: {
    index_count: number
    size_in_bytes: number
  }
}

export interface DeleteStaleStorageRequest {
  /**
   * The value for the "force" flag
   */
  force?: boolean
}

export interface DeleteStaleStorageResponse {
  indices: string[]
  index_count: number
}

export interface GetVersionRequest {}

export interface GetVersionResponse {
  number: string
  build_hash: string
  build_date: string
}

