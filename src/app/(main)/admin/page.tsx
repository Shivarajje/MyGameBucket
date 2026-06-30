'use client';

import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAdminSubmissions } from '@/features/admin/hooks/useAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { GenreCategory } from '@/constants/enums';
import { ShieldAlert, ExternalLink, Check, X, Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { submissions, loading, isAdmin, approveSubmission, rejectSubmission } = useAdminSubmissions();
  
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [genre, setGenre] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  const handleReviewSubmit = async () => {
    if (!selectedSubmissionId || !reviewAction) return;
    setSubmitting(true);
    try {
      if (reviewAction === 'approve') {
        await approveSubmission(selectedSubmissionId, genre);
      } else {
        await rejectSubmission(selectedSubmissionId, reason);
      }
      // Reset
      setSelectedSubmissionId(null);
      setReviewAction(null);
      setGenre('');
      setReason('');
    } catch (err) {
      // Handled by hook toast
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col py-10 pt-28">
        <Container>
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-64 rounded-3xl" />
        </Container>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center py-20 pt-28">
        <ShieldAlert className="w-12 h-12 text-destructive mb-4 animate-pulse" />
        <h2 className="text-xl font-bold">Access Denied</h2>
        <p className="text-sm text-muted-foreground mt-1">You do not have administrator permissions.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col py-10 pt-28">
      <Container>
        <PageHeader
          title="Admin Dashboard"
          subtitle="Review manual game submissions and manage catalog"
        />

        <div className="mt-8">
          <Card className="bg-background/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Pending Submissions ({submissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-muted-foreground font-medium">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Platform</th>
                        <th className="py-3 px-4">Year</th>
                        <th className="py-3 px-4">IGDB Link</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4 font-semibold">{sub.title}</td>
                          <td className="py-4 px-4 text-zinc-300">{sub.platform || '—'}</td>
                          <td className="py-4 px-4 text-zinc-300">{sub.release_year || '—'}</td>
                          <td className="py-4 px-4">
                            {sub.igdb_url ? (
                              <a
                                href={sub.igdb_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                Link
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </td>
                          <td className="py-4 px-4 flex gap-2">
                            <Button
                              size="sm"
                              className="rounded-full bg-green-600 hover:bg-green-500 text-white h-8"
                              onClick={() => {
                                setSelectedSubmissionId(sub.id);
                                setReviewAction('approve');
                              }}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 h-8"
                              onClick={() => {
                                setSelectedSubmissionId(sub.id);
                                setReviewAction('reject');
                              }}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No pending game submissions.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Review Dialog */}
        <Dialog open={selectedSubmissionId !== null} onOpenChange={(open) => !open && setSelectedSubmissionId(null)}>
          <DialogContent className="bg-background/90 backdrop-blur-xl border border-white/10 rounded-3xl max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                {reviewAction === 'approve' ? 'Approve Submission' : 'Reject Submission'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              {reviewAction === 'approve' ? (
                <div className="space-y-2">
                  <Label htmlFor="genre-select">Select Primary Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger id="genre-select" className="rounded-full bg-background/50 border-white/10">
                      <SelectValue placeholder="Choose genre..." />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GenreCategory).map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="reject-reason">Reason for Rejection</Label>
                  <Input
                    id="reject-reason"
                    placeholder="e.g. Duplicate entry, incorrect title"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="rounded-full bg-background/50 border-white/10"
                    required
                  />
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button variant="ghost" onClick={() => setSelectedSubmissionId(null)} className="rounded-full">
                Cancel
              </Button>
              <Button
                onClick={handleReviewSubmit}
                disabled={submitting || (reviewAction === 'approve' ? !genre : !reason.trim())}
                className="rounded-full px-6"
              >
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Container>
    </main>
  );
}
