# SentinAI - LLMOps & Fine-tuning Module

def get_lora_config():
    """
    Configures LoRA (Low-Rank Adaptation) for domain-specific cyber security training.
    As per mail requirement: Model Fine-tuning: PEFT/LoRA.
    """
    lora_settings = {
        "adapter_type": "LoRA",
        "r": 16,                # Rank
        "lora_alpha": 32,       # Alpha scaling
        "target_modules": ["q_proj", "v_proj", "k_proj", "o_proj"], # Transformer layers
        "lora_dropout": 0.05,
        "bias": "none",
        "task_type": "CAUSAL_LM"
    }
    return lora_settings

def strategy_note():
    return """
    STRATEGY: Instead of full-parameter training, we implement PEFT/LoRA. 
    This allows us to fine-tune Llama 3 on proprietary company threat-logs 
    using 90% less VRAM, making it scalable for AWS SageMaker deployment.
    """

if __name__ == "__main__":
    print("✅ PEFT/LoRA Configuration Module: READY")
    print("Settings:", get_lora_config())
    print(strategy_note())