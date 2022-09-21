import { Fn } from 'cdktf';
import { Construct } from 'constructs';
import * as azapi from "../.gen/providers/azapi"

// Construct
/**
 * Properties for the resource group
 */

 export interface AzureContainerAppsProps {
  /**
   * The Azure Region to deploy.
   */
  readonly location: string;
  /**
   * The name of the Azure Container App.
   */
  readonly name: string;
  /**
   * The id of the Azure Resource Group.
   */
   readonly resource_group_id: string;
  /**
   * The tags to assign to the Resource Group.
   */
   readonly tags?: { [key: string]: string; };  
   /**
   * The container name.
   */
   readonly container_name: string;
   /**
   * The container port.
   */
   readonly container_port: number;
   /**
   * The CPU requests to run each container.
   */
   readonly cpu_requests: number;
   /**
   * The container image to deploy.
   */
    readonly image: string;
    /**
   * Enabled ingress.
   */
    readonly ingress_enabled: boolean;
    /**
   * Max amount of replica's container app can scale to.
   */
    readonly max_replicas: number;
    /**
   * Memory request of container app.
   */
    readonly mem_requests: string;
    /**
   * Minimum amount of replicas to kee.
   */
    readonly min_replicas: number;
  /**
   * The container tag of the image to deploy.
   */
    readonly container_tag: string;
  /**
   * The container tag of the image to deploy.
   */
    readonly loganalytics_id: string
      /**
   * The container tag of the image to deploy.
   */
    readonly loganalytics_primary_key: string
    /**
   * The hostname of the Azure container registry.
   */
     readonly acr_url: string
   
}

export class AzureContainerApp extends Construct {
  readonly props: AzureContainerAppsProps;
  

  constructor(scope: Construct, id: string, props: AzureContainerAppsProps) {
    super(scope, id);

    this.props = props;;

    const azapiEnvironment = new azapi.Resource(this, "managed_environment", {
      body:  Fn.jsonencode({ 
        properties: { 
          appLogsConfiguration: {
            destination: "log-analytics", 
            logAnalyticsConfiguration: {
              customerId: props.loganalytics_id,
              sharedKey:   props.loganalytics_primary_key,
          }
        }
      }
    }),
      location: props.location,
      name: props.name + "-env",
      parentId: props.resource_group_id,
      tags: props.tags,
      type: "Microsoft.App/managedEnvironments@2022-03-01",
    });

    

   const aca = new azapi.Resource(this, "container_app", {
      body: Fn.jsonencode({ 
        "identity": {
            "type": "SystemAssigned"
        },
        properties: {
          managedEnvironmentId: azapiEnvironment.id,
          configuration: {
            "registries": [
              {
                  "server": props.acr_url,
                  "identity": "system"
              }
            ],
            ingress: {
              external: props.ingress_enabled,
              targetPort: props.container_port
            }
          },
          template: {
            containers: [
              {
                name: props.container_name,
                image: props.image + ":" + props.container_tag,
                resources: {
                  cpu: props.cpu_requests,
                  memory: props.mem_requests
                }
              }         
            ],
            scale: {
              minReplicas: props.min_replicas,
              maxReplicas: props.max_replicas
            }
          }
        }


      }),
      location: props.location,
      name: props.name,
      parentId: props.resource_group_id,
      tags: props.tags,
      type: "Microsoft.App/containerApps@2022-03-01",
      
    });


    azapiEnvironment.overrideLogicalId("managed_environment")
    aca.overrideLogicalId("container_app")
  }

}
