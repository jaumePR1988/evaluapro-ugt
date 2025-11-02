Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { type, to, subject, htmlContent, templateData } = requestData;

    // Get environment variables
    const smtpUser = Deno.env.get('SMTP_USER') || 'pedragosajaume@gmail.com';
    const smtpPassword = Deno.env.get('SMTP_PASSWORD') || 'towa2022.';
    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.gmail.com';
    const smtpPort = Deno.env.get('SMTP_PORT') || '587';

    if (!smtpPassword) {
      console.log('SMTP_PASSWORD not configured. Simulating email send.');
      console.log('Email details:', { type, to, subject, smtpUser });
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Email simulated (SMTP_PASSWORD not configured)',
        details: { type, to, subject, smtpUser }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create email content based on type
    let emailHtml = htmlContent;
    let emailSubject = subject;

    if (type === 'new_request' && templateData) {
      emailSubject = `Nueva solicitud de valoración - ${templateData.companyName}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background-color: #f9f9f9; }
                .footer { background-color: #333; color: white; padding: 20px; text-align: center; }
                .info-box { background-color: white; padding: 20px; border-radius: 8px; margin: 10px 0; }
                .highlight { color: #dc2626; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>UGT - Evaluación de Puestos de Trabajo</h1>
            </div>
            
            <div class="content">
                <h2>Nueva Solicitud de Valoración Recibida</h2>
                
                <div class="info-box">
                    <h3>Detalles de la Solicitud:</h3>
                    <p><strong>Empresa:</strong> ${templateData.companyName}</p>
                    <p><strong>Puesto:</strong> ${templateData.positionName}</p>
                    <p><strong>Solicitante:</strong> ${templateData.requesterName}</p>
                    <p><strong>Email:</strong> ${templateData.requesterEmail}</p>
                    <p><strong>Convenio:</strong> ${templateData.collectiveAgreement || 'No especificado'}</p>
                    <p><strong>Fecha solicitud:</strong> ${new Date(templateData.createdAt).toLocaleDateString('es-ES')}</p>
                </div>

                <p>Se ha recibido una nueva solicitud de valoración de puesto de trabajo. Por favor, accede al panel de administración para revisar y procesar la solicitud.</p>
                
                <p><strong>Número de solicitud:</strong> <span class="highlight">${templateData.requestId}</span></p>
            </div>
            
            <div class="footer">
                <p>© 2025 Unión General de Trabajadores (UGT)</p>
                <p>Este es un mensaje automático. No respondas a este email.</p>
            </div>
        </body>
        </html>
      `;
    }

    if (type === 'status_update' && templateData) {
      emailSubject = `Actualización de estado - ${templateData.positionName}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background-color: #f9f9f9; }
                .footer { background-color: #333; color: white; padding: 20px; text-align: center; }
                .info-box { background-color: white; padding: 20px; border-radius: 8px; margin: 10px 0; }
                .status { color: #dc2626; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>UGT - Evaluación de Puestos de Trabajo</h1>
            </div>
            
            <div class="content">
                <h2>Actualización de Estado</h2>
                
                <div class="info-box">
                    <h3>Detalles:</h3>
                    <p><strong>Empresa:</strong> ${templateData.companyName}</p>
                    <p><strong>Puesto:</strong> ${templateData.positionName}</p>
                    <p><strong>Estado actual:</strong> <span class="status">${templateData.status}</span></p>
                    ${templateData.message ? `<p><strong>Mensaje:</strong> ${templateData.message}</p>` : ''}
                    ${templateData.evaluationUrl ? `<p><strong>Ver evaluación:</strong> <a href="${templateData.evaluationUrl}">${templateData.evaluationUrl}</a></p>` : ''}
                </div>

                <p>El estado de tu solicitud de valoración ha sido actualizado. Te mantendremos informado sobre el progreso.</p>
            </div>
            
            <div class="footer">
                <p>© 2025 Unión General de Trabajadores (UGT)</p>
                <p>Este es un mensaje automático. No respondas a este email.</p>
            </div>
        </body>
        </html>
      `;
    }

    // Send email using Gmail SMTP
    const nodemailer = `smtps://${encodeURIComponent(smtpUser)}:${encodeURIComponent(smtpPassword)}@${smtpHost}:${smtpPort}`;
    
    // For now, simulate email send until SMTP is fully configured
    console.log('Email would be sent with:', {
      from: smtpUser,
      to: to,
      subject: emailSubject,
      host: smtpHost,
      port: smtpPort
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Email prepared successfully',
      emailDetails: {
        from: smtpUser,
        to: to,
        subject: emailSubject
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({
      error: {
        code: 'EMAIL_ERROR',
        message: error.message
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});