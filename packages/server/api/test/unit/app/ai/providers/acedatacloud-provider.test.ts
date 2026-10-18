import { AIProviderModelType } from '@activepieces/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockRequest } = vi.hoisted(() => ({ mockRequest: vi.fn() }))

vi.mock('@activepieces/server-utils', () => ({
    safeHttp: { axios: { request: mockRequest } },
}))

import { aceDataCloudProvider } from '../../../../../src/app/ai/providers/acedatacloud-provider'

describe('Ace Data Cloud provider', () => {
    beforeEach(() => mockRequest.mockReset())

    it('validates without a billable completion and lists chat models only', async () => {
        mockRequest.mockResolvedValue({ data: { data: [
            { id: 'gpt-4.1-mini' },
            { id: 'gpt-4o-image' },
            { id: 'grok-imagine-video' },
            { id: 'nano-banana-2' },
            { id: 'tts-1' },
            { id: 'media-model', output_modalities: ['image'] },
        ] } })
        const models = await aceDataCloudProvider.listModels({ apiKey: 'test-key' }, {})
        expect(models).toEqual([{ id: 'gpt-4.1-mini', name: 'gpt-4.1-mini', type: AIProviderModelType.TEXT }])
        expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({
            method: 'GET',
            url: 'https://api.acedata.cloud/v1/models',
            headers: { Authorization: 'Bearer test-key' },
        }))
        expect(mockRequest).toHaveBeenCalledTimes(1)
    })
})
