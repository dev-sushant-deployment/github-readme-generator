import Puller from 'pusher-js'
import { NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER } from '@/constants'

export const puller = new Puller(NEXT_PUBLIC_PUSHER_KEY, {
  cluster: NEXT_PUBLIC_PUSHER_CLUSTER
});