import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { patchSettings, testExtraction } from '../../services/authService';
import { Button } from '../ui/Button';

const PROVIDERS = [
  { id: 'groq', label: 'Groq (Llama 3.3 70B)', desc: 'Fastest, Free' },
  { id: 'gemini', label: 'Google Gemini 1.5 Flash', desc: 'Free tier' },
  { id: 'mistral', label: 'Mistral Small', desc: 'Free tier' },
  { id: 'ollama', label: 'Ollama (Local)', desc: 'No API key needed' },
];

export function AIProviderSettings() {
  const { accessToken, updateUser } = useAuthStore();
  const { aiProvider, setAiProvider } = useSettingsStore();
  const [testing, setTesting] = useState(false);

  const save = async (provider: string) => {
    setAiProvider(provider);
    if (!accessToken) return;
    try {
      const res = await patchSettings(accessToken, { aiProvider: provider });
      updateUser(res.settings);
      toast.success('AI provider updated');
    } catch {
      toast.error('Failed to update provider');
    }
  };

  const test = async () => {
    if (!accessToken) return;
    setTesting(true);
    try {
      await testExtraction(accessToken, aiProvider);
      toast.success('Test extraction succeeded!');
    } catch {
      toast.error('Test extraction failed — check API keys');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      {PROVIDERS.map((p) => (
        <label
          key={p.id}
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
            aiProvider === p.id ? 'border-accent bg-accent/10' : 'border-white/10'
          }`}
        >
          <input
            type="radio"
            name="provider"
            checked={aiProvider === p.id}
            onChange={() => save(p.id)}
            className="mt-1"
          />
          <div>
            <p className="font-medium text-white">{p.label}</p>
            <p className="text-sm text-gray-400">{p.desc}</p>
          </div>
        </label>
      ))}
      <p className="text-sm text-gray-500">
        API keys are configured server-side via environment variables (GROQ_API_KEY, GEMINI_API_KEY, etc.)
      </p>
      <Button variant="secondary" onClick={test} disabled={testing}>
        {testing ? 'Testing...' : 'Test Extraction'}
      </Button>
    </div>
  );
}
