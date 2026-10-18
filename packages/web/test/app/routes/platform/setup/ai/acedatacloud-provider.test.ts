import { AIProviderName } from '@activepieces/core-utils';
import { CreateAIProviderRequest } from '@activepieces/shared';
import i18next from 'i18next';
import { beforeAll, describe, expect, it } from 'vitest';

import { providerCredentials } from '@/app/routes/platform/setup/ai/providers-tab/provider-credentials';
import { providerRequestUtils } from '@/app/routes/platform/setup/ai/providers-tab/provider-request';
import { SUPPORTED_AI_PROVIDERS } from '@/features/agents/ai-providers';

describe('Ace Data Cloud provider connection', () => {
  beforeAll(async () => {
    await i18next.init({ lng: 'en', fallbackLng: 'en', resources: {} });
  });

  it('offers the named provider with a secret key and automatic model discovery', () => {
    const provider = AIProviderName.ACEDATACLOUD;
    const card = SUPPORTED_AI_PROVIDERS.find(
      (entry) => entry.provider === provider,
    );

    expect(card?.name).toBe('Ace Data Cloud');
    expect(card?.markdown).toContain(
      'console/applications?utm_source=opensource',
    );
    expect(providerCredentials.fieldsOf({ provider })).toEqual([
      expect.objectContaining({ key: 'apiKey', secret: true }),
    ]);
    expect(providerCredentials.usesManualModels({ provider })).toBe(false);
  });

  it('passes the connected raw key through the actual server request schema', () => {
    const request = providerRequestUtils.buildCreateRequest({
      provider: AIProviderName.ACEDATACLOUD,
      displayName: 'Team Ace key',
      credentials: { apiKey: ' test-key ' },
      headers: {},
    });

    expect(CreateAIProviderRequest.parse(request)).toEqual({
      provider: AIProviderName.ACEDATACLOUD,
      displayName: 'Team Ace key',
      auth: { apiKey: 'test-key' },
      config: {},
    });
  });
});
