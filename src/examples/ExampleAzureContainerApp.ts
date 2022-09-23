import { AzureContainerApp } from '../AzureContainerApp';
import { App, TerraformStack} from "cdktf";
import {ResourceGroup, LogAnalyticsWorkspace, AzurermProvider} from "@cdktf/provider-azurerm";
import {AzapiProvider} from "../../.gen/providers/azapi"
import { Construct } from 'constructs';

const app = new App();

export class exampleAzureContainerApp extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
        features: {},
      });

    new AzapiProvider(this, "azureAzapi", {
    });

    const rg = new ResourceGroup(this, "rg", {
      location: 'eastus',
      name: 'rg-latest',

    });

    const la = new LogAnalyticsWorkspace(this, "log_analytics", {
      location: 'eastus',
      name: 'appinsight-test',
      resourceGroupName: rg.name,
    });

    new AzureContainerApp(this, 'container_app', {
            name: 'acatest888',
            location: 'eastus',
            resource_group_id: rg.id,
            container_name: "tetris",
            container_port: 8080,
            cpu_requests: 0.5,
            image: "uzyexe/tetris",
            ingress_enabled: true,
            max_replicas: 3,
            mem_requests: "1Gi",
            min_replicas: 1,
            container_tag: "latest",
            loganalytics_id: la.workspaceId,
            loganalytics_primary_key: la.primarySharedKey,
            acr_url: "testacr.azurecr.io"
    });
  }
}

new exampleAzureContainerApp(app, "testAzureContainerApp");
    
app.synth();