"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ClientConfigContext, ClientConfigContextItf } from "./ClientConfigContext";
import React, { useContext } from "react";

export const ClientConfigurationForm: FC = () => {
  const form = useFormContext();
    const { setClientConfig, setIsClientConfigSet } = useContext(ClientConfigContext) as ClientConfigContextItf;
  

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (values: any) => {
    console.log('##### IN onSubmit')
    try {
      setIsSubmitting(true);
      console.log(values);
      setClientConfig(values);
      setIsClientConfigSet(true);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onProductChange = async (evt: object) => {
    console.log(evt)
  }

  const onEndSession = async (evt: object) => {
    setIsClientConfigSet(false);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="domain"
        render={({ field }) => (
          <FormItem>
            <FormLabel>MyDomain Url</FormLabel>
            <FormDescription>Die MyDomain Url der Org, indem der Agent verfügbar ist.</FormDescription>
            <FormControl>
              <Input placeholder="https://????.my.salesforce.com" required={true} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Id</FormLabel>
            <FormDescription>Die Client Id der Connected App.</FormDescription>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="clientSecret"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Secret</FormLabel>
            <FormDescription>Client Secret der Connected App.</FormDescription>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="agentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent Id</FormLabel>
            <FormDescription>Die Id des Agenten. Id befindet sich in der URL des Agenten im Agent-Builder</FormDescription>
            <FormControl>
              <Input placeholder="0Xx" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="product"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Produkt</FormLabel>
            <FormDescription>
              Um welches Produkt geht es?
            </FormDescription>
            <FormControl>
              <Input placeholder="Produktname" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" >Start</Button>
      <Button onClick={onProductChange} variant="secondary">Produkt ändern</Button>
      <Button onClick={onEndSession} variant="destructive">Session beenden</Button>
    </form>
  );
};
