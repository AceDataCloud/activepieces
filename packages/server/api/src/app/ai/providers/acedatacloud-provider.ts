import { safeHttp } from '@activepieces/server-utils'
import { AIProviderModel, AIProviderModelType, aiProviderUtils, BaseAIProviderAuthConfig, OpenAiCompatibleVendorConfig } from '@activepieces/shared'
import { AIProviderStrategy, MODEL_LIST_TIMEOUT_MS } from './ai-provider'

async function listModels(auth: BaseAIProviderAuthConfig): Promise<AIProviderModel[]> {
    const response = await safeHttp.axios.request<AceModelsResponse>({
        method: 'GET',
        url: 'https://api.acedata.cloud/v1/models',
        timeout: MODEL_LIST_TIMEOUT_MS,
        maxContentLength: 5 * 1024 * 1024,
        headers: { Authorization: `Bearer ${auth.apiKey}` },
    })
    return (response.data.data ?? [])
        .filter((model) => aiProviderUtils.isChatModelId({ modelId: model.id }))
        .filter((model) => !/(?:image|imagine|video|suno|seedance|seedream|banana|happyhorse|flux|kling|wan[0-9]|tts|embedding)/i.test(model.id))
        .filter((model) => !model.output_modalities || model.output_modalities.includes('text'))
        .map((model) => ({ id: model.id, name: model.id, type: AIProviderModelType.TEXT }))
}

export const aceDataCloudProvider: AIProviderStrategy<BaseAIProviderAuthConfig, OpenAiCompatibleVendorConfig> = {
    name: 'Ace Data Cloud',
    async validateConnection(auth): Promise<void> {
        await listModels(auth)
    },
    async listModels(auth): Promise<AIProviderModel[]> {
        return listModels(auth)
    },
}

type AceModelsResponse = {
    data?: { id: string, output_modalities?: string[] }[]
}
