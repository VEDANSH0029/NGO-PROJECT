import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useRealtimeTable(table, onEvent, filter = null) {
  useEffect(() => {
    if (!table || typeof onEvent !== 'function') return;

    const channelName = `realtime-${table}-${Math.random().toString(36).substring(2, 9)}`;

    const channelConfig = {
      event: '*',
      schema: 'public',
      table
    };

    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', channelConfig, (payload) => {
        onEvent(payload);
      })
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn(`Realtime channel error on table ${table}:`, err?.message || err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);
}

export default useRealtimeTable;

