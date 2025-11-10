import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { EventService } from 'src/app/_services/event.service';
import { SubmissionService } from 'src/app/_services/submission.service';

interface ReviewMainProps {
  authenticationService: AuthenticationService;
  submissionService: SubmissionService;
  eventService: EventService;
}

const ReviewMain: React.FC<ReviewMainProps> = ({
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
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();

  useEffect(() => {
    authenticationService.isAdminGlobal().then(setIsAdmin);
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setEvents([]);
    try {
      const result = await eventService.readForSubmission();
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
    } catch (error) {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao buscar eventos',
        severity: 'error',
      });
    }
  };

  const loadSubmissionsByTrack = (trackData: any) => {
    setTrack(trackData);
  };

  const downloadSubmissions = async () => {
    if (!track) return;

    setDownloading(true);
    try {
      const response = await submissionService.readReportSubmissions(track._id);
      setDownloading(false);
      // downloadXlsxFile(response, `submissoes-${track.name}`);
    } catch (error) {
      setDownloading(false);
      setSnackbar({
        open: true,
        message: 'Erro ao baixar submissões',
        severity: 'error',
      });
    }
  };

  return null;
};

export default ReviewMain;
