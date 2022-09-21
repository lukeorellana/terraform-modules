import { Testing, TerraformStack, testingMatchers} from 'cdktf';
import {AzurermProvider} from "@cdktf/provider-azurerm";
import { AzureContainerApp } from './AzureContainerApp';
import {AzapiProvider} from "../.gen/providers/azapi"
import 'cdktf/lib/testing/adapters/jest';


// test('renders a VPC with minimal config', () => {
//   const synthed = Testing.synthScope((stack) => {
//     new PocketVPC(stack, 'testPocketVPC');
//   });


describe('AzureContainerApp-Snapshot', () => {
  it('renders a AzureContainerApp', () => {

    const synthed = Testing.synthScope((stack) => {
      new AzureContainerApp(stack, 'testACA', {
        name: 'acrtest888',
        location: 'eastus',
        resource_group_id: "rg-test",
        container_name: "test-container",
        container_port: 8080,
        cpu_requests: 2,
        image: "uzyexe/tetris",
        ingress_enabled: true,
        max_replicas: 3,
        mem_requests: "1Gi",
        min_replicas: 1,
        container_tag: "latest",
        loganalytics_id: "loganalyticsid",
        loganalytics_primary_key: "loganalyticskey",
        acr_url: "testacr.azurecr.io"
      });
    });
  
    expect(synthed).toMatchSnapshot();
  });
});


describe("AzureContainerApps-Terraform", () => {
  it("check if the produced terraform configuration is valid", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");
    
    new AzurermProvider(stack, "azureFeature", {
      features: {},
    });

    new AzapiProvider(stack, "azureAzapi", {
    });


    new AzureContainerApp(stack, 'testACA', {
      name: 'acrtest888',
      location: 'eastus',
      resource_group_id: "rg-test",
      container_name: "test-container",
      container_port: 8080,
      cpu_requests: 2,
      image: "uzyexe/tetris",
      ingress_enabled: true,
      max_replicas: 3,
      mem_requests: "1Gi",
      min_replicas: 1,
      container_tag: "latest",
      loganalytics_id: "loganalyticsid",
      loganalytics_primary_key: "loganalyticskey",
      acr_url: "testacr.azurecr.io"
    });


    // We need to do a full synth to validate the terraform configuration
    expect(Testing.fullSynth(stack)).toBeValidTerraform();
  });

  it("check if this can be planned", () => {
    const app = Testing.app();
    const stack = new TerraformStack(app, "test");

    new AzurermProvider(stack, "azureFeature", {
      features: {},
    });

    new AzapiProvider(stack, "azureAzapi", {
    });

    new AzureContainerApp(stack, 'testACA', {
      name: 'acrtest888',
      location: 'eastus',
      resource_group_id: "rg-test",
      container_name: "test-container",
      container_port: 8080,
      cpu_requests: 2,
      image: "uzyexe/tetris",
      ingress_enabled: true,
      max_replicas: 3,
      mem_requests: "1Gi",
      min_replicas: 1,
      container_tag: "latest",
      loganalytics_id: "loganalyticsid",
      loganalytics_primary_key: "loganalyticskey",
      acr_url: "testacr.azurecr.io"
    });


    // We need to do a full synth to plan the terraform configuration
    expect(Testing.fullSynth(stack)).toPlanSuccessfully();
  });
});
