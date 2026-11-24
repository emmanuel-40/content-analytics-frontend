export interface ApiResponse<T = unknown> {
  status: number
  message: string
  data?: T
  timestamp?: string
}

export interface ApiErrorBody {
  timestamp?: string
  status: number
  error?: string
  message: string
  path?: string
  errors?: Record<string, string>
}

export interface CurrentUser {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED'
  emailVerified: boolean
  createdAt?: string
  lastLoginAt?: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  userId: string
  username: string
  email: string
}

export interface CsrfResponse {
  token: string
  headerName: string
}

export interface ProvidersResponse {
  google: boolean
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface Paged<T> {
  content: T[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export interface DocumentResponse {
  id: string
  userId?: string
  fileName: string
  fileSize?: number
  mimeType?: string
  pageCount?: number
  description?: string
  status: DocumentStatus
  processingProgress?: number
  processingError?: string
  createdAt: string
  updatedAt?: string
  processingStartedAt?: string
  processingCompletedAt?: string
  wordCount?: number
  characterCount?: number
  summary?: string
  /** JSON-encoded string array from the backend. */
  keyTopics?: string
  sentiment?: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  confidenceScore?: number
}

export interface DocumentListItem {
  id: string
  fileName: string
  fileSize?: number
  status: DocumentStatus
  processingProgress?: number
  sentiment?: string
  wordCount?: number
  createdAt: string
  processingCompletedAt?: string
}

export interface DocumentStats {
  totalDocuments: number
  completedDocuments: number
  processingDocuments: number
  failedDocuments: number
  totalWords: number
  averageWordCount: number
}

export interface DocumentStatusDto {
  documentId: string
  fileName: string
  status: DocumentStatus
  processingProgress: number
  processingError?: string
  isCompleted: boolean
  isFailed: boolean
  processingCompletedAt?: string
}

export interface DocumentSearchFilter {
  fileName?: string
  status?: string
  sentiment?: string
  topic?: string
  startDate?: string
  endDate?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: string
  sortDirection?: 'ASC' | 'DESC'
}

export interface UserProfile {
  userId: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  bio?: string
  phoneNumber?: string
  location?: string
  timezone?: string
  website?: string
  avatarUrl?: string
  thumbnailUrl?: string
  emailNotifications?: boolean
  twoFactorEnabled?: boolean
  publicProfile?: boolean
  totalDocumentsProcessed?: number
  totalAnalysisRequests?: number
  createdAt?: string
  lastProfileUpdateAt?: string
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  bio?: string
  phoneNumber?: string
  location?: string
  timezone?: string
  website?: string
  emailNotifications?: boolean
  publicProfile?: boolean
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface Subscription {
  tier: string
  status: string
  monthlyCreditAllowance: number
  creditsUsedThisPeriod: number
  purchasedCredits: number
  availableCredits: number
  periodStart?: string
  periodEnd?: string
  autoRenew?: boolean
}

export interface CreditTransaction {
  id: string
  amount: number
  balanceAfter: number
  type: string
  description?: string
  referenceId?: string
  createdAt: string
}

export interface PaymentStatus {
  configured: boolean
  /** True when the backend holds Paystack sk_test_ credentials. */
  testMode: boolean
  /** Fixed credit pack -> price in kobo, e.g. { "10": 100000 }. */
  packs: Record<string, number>
  currency: string
}

export interface InitializePaymentResponse {
  reference: string
  checkoutUrl: string
  accessCode: string
  amountKobo: number
  credits: number
  status: string
  publicKey: string
}

export interface PaymentTransaction {
  id: string
  userId: string
  reference: string
  provider: string
  amountKobo: number
  credits: number
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  checkoutUrl?: string
  paidAt?: string
  createdAt: string
}

export interface HealthStatus {
  status: 'UP' | 'DEGRADED' | 'DOWN'
  timestamp?: string
  uptime?: number
  components?: Record<string, {
    status: string
    message?: string
    responseTimeMs?: number
    lastCheckedAt?: string
  }>
  resources?: {
    cpuUsagePercent?: number
    memoryUsagePercent?: number
    memoryUsageGb?: number
    memoryMaxGb?: number
    diskAvailableGb?: number
    diskTotalGb?: number
  }
  version?: string
  environment?: string
}

export interface WebSocketProgressMessage {
  messageId?: string
  messageType: 'PROGRESS' | 'PROCESSING_COMPLETED' | 'PROCESSING_FAILED' | 'STATUS'
  timestamp?: string
  documentId?: string
  fileName?: string
  userId?: string
  progress?: number
  status?: DocumentStatus
  summary?: string
  keyTopics?: string
  sentiment?: string
  confidenceScore?: number
  wordCount?: number
  errorMessage?: string
  errorCode?: string
  processingTimeMs?: number
  processingStage?: string
}
