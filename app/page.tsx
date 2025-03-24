"use client";
import React, { useContext } from "react";
import { AssistantSidebar } from "@/components/assistant-ui/assistant-sidebar";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { ClientConfigContext, ClientConfigContextItf } from "../components/ClientConfigContext";


import { ClientConfigurationForm } from "@/components/ClientConfigurationForm";

export default function Home() {
  const { clientConfig } = useContext(ClientConfigContext) as ClientConfigContextItf;
  const form = useForm({
    defaultValues: clientConfig
  });

  return (
      <AssistantSidebar>
        <div className="h-full overflow-y-scroll">
          <main className="container py-8">
            <h1 className="mb-2 text-2xl font-semibold">
              Agentforce External Client Test
            </h1>
            <p>
              Hier kann getestet werden!
            </p>
            <Form {...(form as any)}>
              <ClientConfigurationForm />
            </Form>
          </main>
        </div>
      </AssistantSidebar>
    );
}