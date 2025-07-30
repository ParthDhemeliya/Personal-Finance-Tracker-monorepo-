# Docker Container Monitoring Setup

This setup provides comprehensive monitoring for individual Docker containers using cAdvisor, Prometheus, and Grafana.

## Architecture

```
Docker Containers → cAdvisor → Prometheus → Grafana Dashboard
```

## Components

### 1. cAdvisor (Container Advisor)

- **Purpose**: Collects, aggregates, and exports container resource usage and performance characteristics
- **Port**: 8081
- **URL**: http://localhost:8081
- **Metrics**: CPU, Memory, Network, Disk I/O, Container health

### 2. Prometheus

- **Purpose**: Time-series database that scrapes and stores metrics
- **Port**: 9090
- **URL**: http://localhost:9090
- **Targets**: cAdvisor, Backend application

### 3. Grafana

- **Purpose**: Visualization and dashboard platform
- **Port**: 3003
- **URL**: http://localhost:3003
- **Credentials**: admin/admin

## Metrics Available

### CPU Metrics

- `container_cpu_usage_seconds_total` - Total CPU usage in seconds
- `container_cpu_system_seconds_total` - System CPU usage
- `container_cpu_user_seconds_total` - User CPU usage

### Memory Metrics

- `container_memory_usage_bytes` - Current memory usage
- `container_memory_max_usage_bytes` - Maximum memory usage
- `container_memory_cache` - Memory cache usage
- `container_memory_rss` - Resident set size

### Network Metrics

- `container_network_receive_bytes_total` - Total bytes received
- `container_network_transmit_bytes_total` - Total bytes transmitted
- `container_network_receive_packets_total` - Total packets received
- `container_network_transmit_packets_total` - Total packets transmitted

### Disk Metrics

- `container_fs_reads_bytes_total` - Total bytes read from filesystem
- `container_fs_writes_bytes_total` - Total bytes written to filesystem
- `container_fs_usage_bytes` - Filesystem usage

### Health Metrics

- `container_last_seen` - Last time container was seen
- `container_start_time_seconds` - Container start time

## Dashboard Features

The custom Grafana dashboard includes:

1. **CPU Usage Panel** - Real-time CPU utilization per container
2. **Memory Usage Panel** - Memory consumption trends
3. **Network I/O Panels** - Network receive/transmit rates
4. **Disk I/O Panels** - Filesystem read/write operations
5. **Container Metrics Summary Table** - Overview of all containers
6. **Container Health Status** - Health indicators

## Quick Start

### Option 1: Using the Batch Script

```bash
start-docker-monitoring.bat
```

### Option 2: Manual Commands

```bash
# Stop existing containers
docker-compose down

# Start with cAdvisor
docker-compose up -d

# Check status
docker-compose ps
```

## Verification Steps

1. **Check cAdvisor is running**:

   ```bash
   curl http://localhost:8081/metrics | grep container_
   ```

2. **Check Prometheus targets**:

   - Visit http://localhost:9090/targets
   - Verify cAdvisor target is "UP"

3. **Check Grafana dashboard**:
   - Visit http://localhost:3003
   - Login with admin/admin
   - Navigate to "Docker Container Monitoring" dashboard

## Troubleshooting

### cAdvisor not collecting metrics

- Ensure Docker daemon is running
- Check if cAdvisor container has privileged access
- Verify volume mounts are correct

### Prometheus can't scrape cAdvisor

- Check if cAdvisor is accessible on port 8080
- Verify Prometheus configuration in `prometheus.yml`
- Check Docker network connectivity

### Grafana dashboard shows no data

- Ensure Prometheus data source is configured
- Check if metrics are being collected
- Verify time range in dashboard

## Customization

### Adding New Metrics

1. Identify the metric in cAdvisor output
2. Add to Prometheus queries in dashboard
3. Create new panels in Grafana

### Modifying Dashboard

1. Edit `backend/grafana/dashboards/docker-container-monitoring.json`
2. Restart Grafana container
3. Dashboard will auto-reload

### Alerting

You can add alerting rules in Prometheus:

```yaml
groups:
  - name: container_alerts
    rules:
      - alert: HighCPUUsage
        expr: container_cpu_usage_seconds_total > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: 'High CPU usage detected'
```

## Performance Considerations

- **Scrape Interval**: Set to 15s for balance between accuracy and performance
- **Retention**: Prometheus data retention can be configured
- **Resource Usage**: cAdvisor adds minimal overhead (~1-2% CPU)

## Security Notes

- cAdvisor runs with privileged access to access container metrics
- Consider network isolation for production deployments
- Use authentication for Grafana in production

## Useful Commands

```bash
# View cAdvisor logs
docker logs cadvisor

# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Export Prometheus metrics
curl http://localhost:9090/api/v1/export

# Check container resource usage directly
docker stats
```

## Next Steps

1. Set up alerting rules for critical thresholds
2. Configure data retention policies
3. Add custom metrics from your application
4. Set up backup and monitoring for the monitoring stack itself
