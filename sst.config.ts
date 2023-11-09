import { SSTConfig } from "sst";
import { ExampleStack } from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "my-sst-static-site-app",
      region: "ap-southeast-2",
      profile: 'default'
    };
  },
  stacks(app) {
    app.stack(ExampleStack);
  }
} satisfies SSTConfig;
