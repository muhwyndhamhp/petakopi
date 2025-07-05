/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'petakopi',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'cloudflare',
      providers: { cloudflare: '6.3.1' },
    };
  },
  async run() {
    const bucket = new sst.cloudflare.Bucket('PetaKopiBucket');
    const id = `${process.env.CLOUDFLARE_DEFAULT_ACCOUNT_ID ?? ''}/db-bucket/APAC`;

    const bucketDomainName = $app.stage === 'production' ? 'prod-kopimap.mwyndham.dev' : 'resource-kopimap.mwyndham.dev';

    const customDomain = new cloudflare.R2CustomDomain('PetaKopiBucketDomain', {
      accountId: process.env.CLOUDFLARE_DEFAULT_ACCOUNT_ID ?? '',
      bucketName: bucket.name,
      domain: bucketDomainName,
      enabled: true,
      zoneId: process.env.CLOUDFLARE_DOMAIN_ZONE_ID ?? '',
    });

    const dbBucket = cloudflare.R2Bucket.get('DbBucket', id, {
      accountId: process.env.CLOUDFLARE_DEFAULT_ACCOUNT_ID ?? '',
      name: 'db-bucket',
    });

    const linkedDbBucket = new sst.Linkable('DbBucket', {
      properties: {
        bucket: dbBucket,
      },
      include: [
        sst.cloudflare.binding({
          type: 'r2BucketBindings',
          properties: {
            bucketName: dbBucket.name,
          },
        }),
      ],
    });

    const secrets = [new sst.Secret('IssuerUrl')];

    const kv = new sst.cloudflare.Kv('PetaKopiKV');
    const hono = new sst.cloudflare.Worker('PetaKopi', {
      url: true,
      link: [bucket, linkedDbBucket, kv, customDomain, ...secrets],
      handler: './server/src/index.ts',
      assets: {
        directory: './dist',
      },
      environment: {
        BUCKET_DOMAIN: bucketDomainName,
      },
      domain:
        $app.stage === 'production'
          ? 'kopimap.mwyndham.dev'
          : 'dev-kopimap.mwyndham.dev',
    });
    return {
      api: hono.url,
      // dev: build,
    };
  },
});
