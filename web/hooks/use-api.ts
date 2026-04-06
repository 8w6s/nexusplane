import useSWR from 'swr';
import { fetcher } from '@/lib/api-client';
import { Node, Instance, ShopPlan } from '@/types';

export function useNodes() {
  const { data, error, mutate } = useSWR<{ nodes: Node[] }>('/admin/nodes', fetcher, {
    refreshInterval: 5000, 
  });
  return {
    nodes: data?.nodes || [],
    isLoading: !error && !data,
    isError: error,
    mutateNodes: mutate,
  };
}

export function useServers() {
  const { data, error, mutate } = useSWR<{ servers: Instance[] }>('/servers', fetcher, {
    refreshInterval: 5000,
  });
  return {
    servers: data?.servers || [],
    isLoading: !error && !data,
    isError: error,
    mutateServers: mutate,
  };
}

export function usePlans() {
  const { data, error } = useSWR<{ plans: ShopPlan[] }>('/catalog/plans', fetcher);
  return {
    plans: data?.plans || [],
    isLoading: !error && !data,
    isError: error,
  };
}
