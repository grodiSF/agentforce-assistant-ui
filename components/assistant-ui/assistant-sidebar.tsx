"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { FC, PropsWithChildren } from "react";
import { ClientConfigContext, ClientConfigContextItf } from "../ClientConfigContext";
import React, { useContext } from "react";
import { AgentforceRuntimeProvider } from "../AgentforceRuntimeProvider";
import { Thread } from "./thread";

export const AssistantSidebar: FC<PropsWithChildren> = ({ children }) => {

  const { isClientConfigSet } = useContext(ClientConfigContext) as ClientConfigContextItf;

    return (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>{children}</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>

        {
          !isClientConfigSet && 

            <div className="h-full overflow-y-scroll">
              <main className="container py-8">
                <h1 className="mb-2 text-2xl font-semibold"> The Agent will be here! </h1>
                <p className="my-4 font-bold text-red-600">
                  Please provide the configuration data!
                </p>

              </main>
            </div>
        }
        {
          isClientConfigSet && 
          <div className="h-full overflow-y-scroll">
            <AgentforceRuntimeProvider>
              <Thread></Thread>
            </AgentforceRuntimeProvider>
            </div>
        }
        </ResizablePanel>
      </ResizablePanelGroup>
    );

};
