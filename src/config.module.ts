import { DynamicModule, Module, Provider } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

/**
 * Simple configuration options
 */
export interface ConfigOptions<T = any> {
  name: string;
  schema: new () => T;
  envPrefix?: string;
  freeze?: boolean;
}

/**
 * Simple Feature Config Module
 */
@Module({})
export class FeatureConfigModule {
  static register<T>(options: ConfigOptions<T>): DynamicModule {
    const { name, schema, envPrefix, freeze = true } = options;
    
    const configToken = `CONFIG_${name.toUpperCase()}`;
    
    const provider: Provider = {
      provide: configToken,
      useFactory: () => {
        // Extract env vars with prefix
        const prefix = envPrefix || name.toUpperCase();
        const envVars = this.extractEnvVars(prefix);
        
        // Transform to camelCase
        const config = this.toCamelCase(envVars);
        
        // Validate against schema
        const instance = plainToInstance(schema, config, {
          enableImplicitConversion: true,
        });
        
        const errors = validateSync(instance as object);
        
        if (errors.length > 0) {
          const errorMessages = errors.map(err => 
            Object.values(err.constraints || {}).join(', ')
          ).join('; ');
          
          throw new Error(`Configuration validation failed: ${errorMessages}`);
        }
        
        return freeze ? Object.freeze(instance) : instance;
      },
    };
    
    return {
      module: FeatureConfigModule,
      providers: [provider],
      exports: [provider],
    };
  }
  
  static registerMultiple(configs: ConfigOptions[]): DynamicModule {
    const providers = configs.map(config => {
      const configToken = `CONFIG_${config.name.toUpperCase()}`;
      return {
        provide: configToken,
        useFactory: () => this.createConfig(config),
      };
    });
    
    return {
      module: FeatureConfigModule,
      providers,
      exports: providers,
    };
  }
  
  private static extractEnvVars(prefix: string): Record<string, string> {
    const result: Record<string, string> = {};
    const prefixWithUnderscore = `${prefix}_`;
    
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith(prefixWithUnderscore) && value !== undefined) {
        const newKey = key.substring(prefixWithUnderscore.length);
        result[newKey] = value;
      }
    }
    
    return result;
  }
  
  private static toCamelCase(obj: Record<string, string>): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.toLowerCase().replace(/_([a-z])/g, (_, letter) => 
        letter.toUpperCase()
      );
      result[camelKey] = value;
    }
    
    return result;
  }
  
  private static createConfig<T>(options: ConfigOptions<T>): T {
    // Implementation similar to register method
    const { schema, envPrefix, name, freeze = true } = options;
    const prefix = envPrefix || name.toUpperCase();
    const envVars = this.extractEnvVars(prefix);
    const config = this.toCamelCase(envVars);
    
    const instance = plainToInstance(schema, config, {
      enableImplicitConversion: true,
    });
    
    const errors = validateSync(instance as object);
    
    if (errors.length > 0) {
      const errorMessages = errors.map(err => 
        Object.values(err.constraints || {}).join(', ')
      ).join('; ');
      
      throw new Error(`Configuration validation failed: ${errorMessages}`);
    }
    
    return freeze ? Object.freeze(instance) : instance;
  }
}

/**
 * Helper to generate injection token
 */
export function ConfigToken(name: string): string {
  return `CONFIG_${name.toUpperCase()}`;
}