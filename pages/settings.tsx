import JetAppLayout from '../jet/layouts/app-layout';
import JetDeleteUserForm from '../jet/domains/settings/delete-user-form';
import JetSectionBorder from '../jet/components/section-border';
import JetTwoFactorAuthenticationForm from '../jet/domains/settings/two-factor-authentication-form';
import JetUpdatePasswordForm from '../jet/domains/settings/update-password-form';
import JetUpdateProfileInformationForm from '../jet/domains/settings/update-profile-information-form';
import { redirectIfGuest, useFeatures } from '../jet/helpers/auth';

export default function Settings() {
  const {
    canUpdateProfileInformation,
    updatePasswords,
    canManageTwoFactorAuthentication,
    hasAccountDeletionFeatures,
  } = useFeatures();

  return (
    <JetAppLayout pageTitle={'User Settings'} header={'Profile Settings'}>
      <div>
        <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
          {canUpdateProfileInformation && (
            <>
              <JetUpdateProfileInformationForm />
              <JetSectionBorder />
            </>
          )}
          {updatePasswords && (
            <>
              <div className="mt-10 sm:mt-0">
                <JetUpdatePasswordForm />
              </div>
              <JetSectionBorder />
            </>
          )}
          {canManageTwoFactorAuthentication && (
            <>
              <div className="mt-10 sm:mt-0">
                <JetTwoFactorAuthenticationForm />
              </div>
              <JetSectionBorder />
            </>
          )}
          {/* <div className="mt-10 sm:mt-0">
            @livewire('profile.logout-other-browser-sessions-form')
          </div> */}
          {hasAccountDeletionFeatures && (
            <>
              {/* <SectionBorder /> */}
              <div className="mt-10 sm:mt-0">
                <JetDeleteUserForm />
              </div>
            </>
          )}
        </div>
      </div>
    </JetAppLayout>
  );
}

export const getServerSideProps = redirectIfGuest();
