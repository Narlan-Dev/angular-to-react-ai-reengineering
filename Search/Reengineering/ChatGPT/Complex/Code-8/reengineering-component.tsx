import React, { useEffect, useState, useCallback } from 'react';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SubmissionService } from 'src/app/_services/submission.service';
import { EventService } from 'src/app/_services/event.service';
import { Snackbar, Alert, CircularProgress, Button } from '@mui/material';

interface Props {
  authenticationService: AuthenticationService;
  submissionService: SubmissionService;
  eventService: EventService;
}

const ReviewMain: React.FC<Props> = ({
  authenticationService,
  submissionService,
  eventService,
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [track, setTrack] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Inicialização e detecção de admin
  useEffect(() => {
    authenticationService.isAdminGlobal().then(setIsAdmin);
    fetchEvents();
    // eslint-disable-next-line
  }, []);

  // Simula router.events do Angular
  // Adapte para sua lógica de navegação se necessário

  // Busca eventos
  const fetchEvents = useCallback(() => {
    setLoading(true);
    setEvents([]);
    eventService
      .readForSubmission()
      .then((result: any) => {
        setLoading(false);
        if (result.status === 'success') {
          setEvents(result.data);
        } else {
          setSnackbar({
            open: true,
            message: result.message,
            severity: 'error',
          });
        }
      })
      .catch((error: any) => {
        setLoading(false);
        setSnackbar({ open: true, message: error, severity: 'error' });
      });
  }, [eventService]);

  // Seleciona track
  const loadSubmissionsByTrack = (track: any) => {
    setTrack(track);
  };

  // Download de submissões
  const downloadSubmissions = () => {
    if (!track) return;
    setDownloading(true);
    submissionService
      .readReportSubmissions(track._id)
      .then((response: any) => {
        setDownloading(false);
        downloadXlsxFile(response, `submissoes-${track.name}`);
      })
      .catch((error: any) => {
        setDownloading(false);
        setSnackbar({ open: true, message: error, severity: 'error' });
      });
  };

  // Função utilitária para download de arquivo XLSX
  const downloadXlsxFile = (data: any, filename: string) => {
    // Implemente a lógica de download conforme necessário
    // Exemplo: use FileSaver.js ou Blob para baixar o arquivo
  };

  return null; // Substitua por JSX conforme o template Angular original
};

export default ReviewMain;
