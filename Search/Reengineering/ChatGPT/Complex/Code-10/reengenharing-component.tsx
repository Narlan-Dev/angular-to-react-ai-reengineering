import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useSubmissions, SubmissionElement } from '../hooks/useSubmissions';
import { toast } from 'react-toastify';

type RouteParams = {
  statusReview?: string;
  track?: string;
};

export const ReviewStatus: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<RouteParams>();
  const rawStatus =
    params.statusReview ??
    new URLSearchParams(location.search).get('statusReview');
  const rawTrack =
    params.track ?? new URLSearchParams(location.search).get('track');

  const [statusReview, setStatusReview] = useState<boolean>(() =>
    rawStatus ? JSON.parse(rawStatus) : false
  );
  const [track, setTrack] = useState<any>(() => {
    if (!rawTrack) return null;
    try {
      return JSON.parse(rawTrack);
    } catch {
      return rawTrack;
    }
  });

  const [filterValue, setFilterValue] = useState('');
  const [selectedSubmission, setSelectedSubmission] =
    useState<SubmissionElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const {
    loading,
    submissions,
    setSubmissions,
    downloading,
    fetchByStatusTrack,
    downloadReportByApprovalStatus,
    reportSubmissionStatusByEmail,
  } = useSubmissions('/api');

  const fetchSubmissionStatusEvent = useCallback(async () => {
    try {
      await fetchByStatusTrack(track, statusReview);
    } catch (err: any) {
      toast.error(err?.message ?? 'Erro ao buscar submissões');
    }
  }, [fetchByStatusTrack, statusReview, track]);

  useEffect(() => {
    if (rawStatus) {
      try {
        setStatusReview(JSON.parse(rawStatus));
      } catch {
        setStatusReview(rawStatus === 'true');
      }
    }
    if (rawTrack) {
      try {
        setTrack(JSON.parse(rawTrack));
      } catch {
        setTrack(rawTrack);
      }
    }

    fetchSubmissionStatusEvent();
  }, [rawStatus, rawTrack]);

  useEffect(() => {
    if (
      location.pathname === '/home/review-status' ||
      location.pathname === '/home/(content:review-status)'
    ) {
      fetchSubmissionStatusEvent();
    }
  }, [location.pathname, fetchSubmissionStatusEvent]);

  const filteredSubmissions = useMemo(() => {
    if (!filterValue) return submissions;
    const value = filterValue.trim().toLowerCase();
    return submissions.filter((s) => {
      const title = (s.title ?? '').toString().toLowerCase();
      const knowledge = (s.knowledge_area ?? '').toString().toLowerCase();
      const authors = Array.isArray(s.authors)
        ? s.authors.join(' ').toLowerCase()
        : (s.authors ?? '').toString().toLowerCase();
      return (
        title.includes(value) ||
        knowledge.includes(value) ||
        authors.includes(value)
      );
    });
  }, [filterValue, submissions]);

  const openDetailsDialog = useCallback((submission: SubmissionElement) => {
    setSelectedSubmission(submission);
  }, []);

  const handleDownload = useCallback(
    async (status: boolean) => {
      try {
        const trackId = track?._id ?? track;
        await downloadReportByApprovalStatus(trackId, status);
        toast.success('Download iniciado');
      } catch (err: any) {
        toast.error(err?.message ?? 'Erro ao baixar relatório');
      }
    },
    [downloadReportByApprovalStatus, track]
  );

  const sendSubmissionResultByEmail = useCallback(
    async (status: boolean) => {
      const payload = submissions.map((submission) => ({
        owner: (submission as any).owner,
        submissionId: submission._id,
        event: (submission as any).event,
      }));
      const userConfirmed = window.confirm(
        `Deseja comunicar o resultado via e-mail para os ${payload.length} participantes envolvidos?`
      );
      if (!userConfirmed) return;

      try {
        await reportSubmissionStatusByEmail(payload, status);
        toast.success('E-mails enviados com sucesso!');
      } catch (err: any) {
        toast.error(err?.message ?? 'Erro ao enviar e-mails');
      }
    },
    [reportSubmissionStatusByEmail, submissions]
  );

  const applyFilter = useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  return;
};
