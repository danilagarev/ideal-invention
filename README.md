# LMS RPC Cache Server

## Configuring for use with your project

### Running locally

Requirements for usage locally:

- `node` v15 or higher
- `npm` v7 or higher
- Docker Compose
- Docker

Create a .env file with the following contents:

```
ENV=local
MONGO_HOSTNAME=mongodb
READER_PORT=3000
STORE_ADDRESS=<YOUR_STORE_PUBKEY>
```

Building:

```bash
tsc
```

Then, to run the project, execute:

```bash
docker-compose up
```